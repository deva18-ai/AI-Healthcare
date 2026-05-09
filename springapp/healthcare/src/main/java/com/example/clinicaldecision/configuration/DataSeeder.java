package com.example.clinicaldecision.configuration;

import com.example.clinicaldecision.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AuthService authService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Seeding default clinical data for development profile...");
        authService.createDefaultDoctor();
    }
}
