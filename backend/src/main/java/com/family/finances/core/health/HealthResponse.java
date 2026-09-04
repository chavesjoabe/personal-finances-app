package com.family.finances.core.health;

import java.util.Map;

public record HealthResponse(
        String status,
        String service,
        String timestamp,
        Map<String, String> checks
) {
}
