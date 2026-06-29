<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class AdminActivityController extends Controller
{
    /**
     * Get paginated list of activity logs
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        
        $activities = Activity::with('causer')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($activities);
    }
}
