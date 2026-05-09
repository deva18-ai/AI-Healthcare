package com.example.clinicaldecision.configuration;

import com.example.clinicaldecision.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataConfiguration {

    @Bean
    @ConditionalOnProperty(name = "app.seed-default-doctor", havingValue = "true")
    public CommandLineRunner seedDefaultDoctor(AuthService authService) {
        return args -> authService.createDefaultDoctor();
    }
}
