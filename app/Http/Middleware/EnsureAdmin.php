<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/** Server-side RBAC gate: blocks every non-admin with 403, regardless of what the UI shows. */
class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        abort_unless($request->user()?->isAdmin(), 403, 'Admins only.');
        return $next($request);
    }
}
