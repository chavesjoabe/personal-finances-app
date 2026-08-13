package com.family.finances.core.config;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

@ApplicationScoped
public class CategoryAndMemberSeedConfig {

  void onStartup(@Observes StartupEvent startupEvent) {
    // Members and Categories are dynamically created per User upon registration
  }
}
