<?php

namespace App\Policies;

use App\Models\Job;
use App\Models\User;

class JobPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Job $job): bool
    {
        return $user->role === 'employer' && $user->employer->id === $job->employer_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Job $job): bool
    {
        return $user->role === 'employer' && $user->employer->id === $job->employer_id;
    }

    /**
     * Determine whether the user can view applications of the model.
     */
    public function viewApplications(User $user, Job $job): bool
    {
        return $user->role === 'employer' && $user->employer->id === $job->employer_id;
    }
}
