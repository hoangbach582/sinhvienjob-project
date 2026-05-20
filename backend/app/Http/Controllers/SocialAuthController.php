<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\StudentProfile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class SocialAuthController extends Controller
{
    /**
     * Get the Google authentication URL.
     */
    public function getGoogleUrl()
    {
        try {
            /** @var \Laravel\Socialite\Two\GoogleProvider $provider */
            $provider = Socialite::driver('google');
            $url = $provider->stateless()->redirect()->getTargetUrl();
            return response()->json(['url' => $url]);
        } catch (\Exception $e) {
            Log::error('Error getting Google auth URL: ' . $e->getMessage());
            return response()->json(['message' => 'Cannot generate Google Auth URL'], 500);
        }
    }

    /**
     * Handle the callback from Google.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            // The frontend should send the code in the JSON body.
            // Socialite stateless reads from the current request instance.
            /** @var \Laravel\Socialite\Two\GoogleProvider $provider */
            $provider = Socialite::driver('google');
            $googleUser = $provider->stateless()->user();

            // Find existing user by email or google_id
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // If user exists but google_id is not set, update it
                if (!$user->google_id) {
                    $user->google_id = $googleUser->getId();
                    // Optional: Update email_verified_at if it's null, since Google verified it
                    if (!$user->email_verified_at) {
                        $user->email_verified_at = now();
                        $user->email_verified = true;
                    }
                    $user->save();
                }
            } else {
                // Create a new user if one doesn't exist
                $user = User::create([
                    'name' => $googleUser->getName() ?? 'User',
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => Hash::make(Str::random(24)), // Random password for social login
                    'role' => 'student', // Default role is student
                    'email_verified_at' => now(), // Mark email as verified
                    'email_verified' => true,
                ]);

                // Create associated StudentProfile
                StudentProfile::create([
                    'user_id' => $user->id,
                    'full_name' => $googleUser->getName() ?? 'User',
                    'avatar' => $googleUser->getAvatar(),
                ]);
            }

            // Generate Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Load profile for response if it's a student
            $profile = null;
            if ($user->role === 'student') {
                $profile = StudentProfile::where('user_id', $user->id)->first();
            }

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'profile' => $profile
            ]);

        } catch (\Exception $e) {
            Log::error('Google Auth Callback Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Authentication failed', 'error' => $e->getMessage()], 401);
        }
    }
}
