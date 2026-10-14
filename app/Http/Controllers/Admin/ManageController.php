<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Alert, EvacuationCenter, Guideline, Hotline};
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * One CRUD controller for alerts, evacuation centers, hotlines and guidelines.
 * Each resource is declared once in config(); the React page builds its form from that definition.
 * Only whitelisted resources resolve (anything else = 404), so arbitrary models can't be reached.
 */
class ManageController extends Controller
{
    private function config(string $resource): array
    {
        $t = fn ($n, $l, $rule, $type = 'text', $opts = null) => ['name' => $n, 'label' => $l, 'type' => $type, 'rule' => $rule, 'options' => $opts];

        $all = [
            'alerts' => ['model' => Alert::class, 'fields' => [
                $t('title', 'Title', 'required|string|max:150'),
                $t('type', 'Disaster type', 'required|in:typhoon,flood,earthquake,landslide,fire,other', 'select', ['typhoon', 'flood', 'earthquake', 'landslide', 'fire', 'other']),
                $t('severity', 'Severity', 'required|in:advisory,watch,warning,critical', 'select', ['advisory', 'watch', 'warning', 'critical']),
                $t('barangays', 'Affected barangays', 'nullable|string|max:255'),
                $t('message', 'Message', 'required|string|max:2000', 'textarea'),
                $t('expires_at', 'Expires at', 'nullable|date', 'datetime-local'),
            ]],
            'centers' => ['model' => EvacuationCenter::class, 'fields' => [
                $t('name', 'Center name', 'required|string|max:150'),
                $t('barangay', 'Barangay', 'required|string|max:100'),
                $t('address', 'Address', 'nullable|string|max:255'),
                $t('capacity', 'Capacity', 'required|integer|min:0|max:100000', 'number'),
                $t('occupied', 'Currently sheltered', 'required|integer|min:0|max:100000', 'number'),
                $t('status', 'Status', 'required|in:open,full,closed', 'select', ['open', 'full', 'closed']),
                $t('contact', 'Contact', 'nullable|string|max:100'),
                $t('latitude', 'Latitude', 'nullable|numeric|between:-90,90', 'number'),
                $t('longitude', 'Longitude', 'nullable|numeric|between:-180,180', 'number'),
            ]],
            'hotlines' => ['model' => Hotline::class, 'fields' => [
                $t('name', 'Name', 'required|string|max:150'),
                $t('category', 'Category', 'required|in:emergency,police,fire,medical,disaster,barangay', 'select', ['emergency', 'police', 'fire', 'medical', 'disaster', 'barangay']),
                $t('number', 'Number', ['required', 'regex:/^[0-9+\-\s()]{3,40}$/']),
            ]],
            'guidelines' => ['model' => Guideline::class, 'fields' => [
                $t('title', 'Title', 'required|string|max:150'),
                $t('category', 'When', 'required|in:before,during,after', 'select', ['before', 'during', 'after']),
                $t('body', 'Guideline text', 'required|string|max:5000', 'textarea'),
            ]],
        ];
        abort_unless(isset($all[$resource]), 404);
        return $all[$resource];
    }

    private function rules(array $cfg): array
    {
        return collect($cfg['fields'])->mapWithKeys(fn ($f) => [$f['name'] => $f['rule']])->all();
    }

    public function index(string $resource)
    {
        $cfg = $this->config($resource);
        return Inertia::render('Admin/Manage', [
            'resource' => $resource,
            'fields'   => collect($cfg['fields'])->map(fn ($f) => collect($f)->except('rule'))->all(),
            'rows'     => $cfg['model']::latest()->paginate(15),
        ]);
    }

    public function store(Request $r, string $resource)
    {
        $cfg  = $this->config($resource);
        $data = $r->validate($this->rules($cfg));
        if ($resource === 'alerts') $data['user_id'] = $r->user()->id; // record who posted it
        $cfg['model']::create($data);
        return back();
    }

    public function update(Request $r, string $resource, int $id)
    {
        $cfg = $this->config($resource);
        $cfg['model']::findOrFail($id)->update($r->validate($this->rules($cfg)));
        return back();
    }

    public function destroy(string $resource, int $id)
    {
        $this->config($resource)['model']::findOrFail($id)->delete();
        return back();
    }
}
