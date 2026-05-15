<?php

namespace App\Services;

use App\Models\RefreshToken;

class RiskAnalyzer
{
    // Risk levels
    public const LEVEL_LOW    = 'low';
    public const LEVEL_MEDIUM = 'medium';
    public const LEVEL_HIGH   = 'high';

    public function analyze(RefreshToken $stored, array $current): array
    {
        $score  = 0;
        $flags  = [];

        // IP mismatch — +40
        if ($stored->ip_address && $stored->ip_address !== $current['ip_address']) {
            $score += 40;
            $flags[] = 'ip_mismatch';
        }

        // Device type mismatch — +30
        if ($stored->device_type && $stored->device_type !== $current['device_type']) {
            $score += 30;
            $flags[] = 'device_type_mismatch';
        }

        // OS mismatch — +20
        if ($stored->operating_system && $stored->operating_system !== $current['operating_system']) {
            $score += 20;
            $flags[] = 'os_mismatch';
        }

        // Browser mismatch — +10
        if ($stored->browser_name && $stored->browser_name !== $current['browser_name']) {
            $score += 10;
            $flags[] = 'browser_mismatch';
        }

        return [
            'score' => $score,
            'level' => $this->level($score),
            'flags' => $flags,
        ];
    }

    private function level(int $score): string
    {
        if ($score >= 60) return self::LEVEL_HIGH;
        if ($score >= 20) return self::LEVEL_MEDIUM;
        return self::LEVEL_LOW;
    }
}