<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Employer;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $jobs = Job::where('is_active', true)->where('status', 'active')->orderBy('created_at', 'desc')->get();
        $employers = Employer::where('is_verified', true)->orderBy('created_at', 'desc')->get();

        $baseUrl = env('FRONTEND_URL', 'http://localhost:5173');

        $content = '<?xml version="1.0" encoding="UTF-8"?>';
        $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Static routes
        $staticRoutes = [
            '/',
            '/jobs',
            '/companies',
            '/login',
            '/register',
        ];

        foreach ($staticRoutes as $route) {
            $content .= '<url>';
            $content .= '<loc>' . $baseUrl . $route . '</loc>';
            $content .= '<changefreq>daily</changefreq>';
            $content .= '<priority>0.8</priority>';
            $content .= '</url>';
        }

        // Dynamic jobs
        foreach ($jobs as $job) {
            $content .= '<url>';
            $content .= '<loc>' . $baseUrl . '/job/' . $job->id . '</loc>';
            $content .= '<lastmod>' . $job->updated_at->tz('UTC')->toAtomString() . '</lastmod>';
            $content .= '<changefreq>weekly</changefreq>';
            $content .= '<priority>0.9</priority>';
            $content .= '</url>';
        }

        // Dynamic employers
        foreach ($employers as $employer) {
            $content .= '<url>';
            $content .= '<loc>' . $baseUrl . '/company/' . $employer->id . '</loc>';
            $content .= '<lastmod>' . $employer->updated_at->tz('UTC')->toAtomString() . '</lastmod>';
            $content .= '<changefreq>weekly</changefreq>';
            $content .= '<priority>0.7</priority>';
            $content .= '</url>';
        }

        $content .= '</urlset>';

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
