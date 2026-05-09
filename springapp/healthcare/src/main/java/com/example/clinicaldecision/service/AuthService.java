package com.example.clinicaldecision.service;

import com.example.clinicaldecision.dto.LoginRequest;
import com.example.clinicaldecision.exception.UnauthorizedAccessException;
import com.example.clinicaldecision.model.Doctor;
import com.example.clinicaldecision.repository.DoctorRepository;
import com.example.clinicaldecision.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.default-doctor.email}")
    private String defaultDoctorEmail;

    @Value("${app.default-doctor.password}")
    private String defaultDoctorPassword;

    @Value("${app.default-doctor.name}")
    private String defaultDoctorName;

    @Value("${app.default-doctor.specialization}")
    private String defaultDoctorSpecialization;

    public Map<String, String> login(LoginRequest request) {
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(request.getEmail());

        if (doctorOpt.isEmpty()) {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        Doctor doctor = doctorOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), doctor.getPassword())) {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(doctor.getEmail(), doctor.getId());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", doctor.getEmail());
        response.put("name", doctor.getName());
        response.put("specialization", doctor.getSpecialization());

        return response;
    }

    public Map<String, String> register(com.example.clinicaldecision.dto.RegisterRequest request) {
        if (doctorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setEmail(request.getEmail());
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        doctor.setSpecialization(request.getSpecialization());
        doctorRepository.save(doctor);

        String token = jwtUtil.generateToken(doctor.getEmail(), doctor.getId());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("email", doctor.getEmail());
        response.put("name", doctor.getName());
        response.put("specialization", doctor.getSpecialization());

        return response;
    }

    public void createDefaultDoctor() {
        if (!doctorRepository.existsByEmail(defaultDoctorEmail)) {
            Doctor doctor = new Doctor();
            doctor.setName(defaultDoctorName);
            doctor.setEmail(defaultDoctorEmail);
            doctor.setPassword(passwordEncoder.encode(defaultDoctorPassword));
            doctor.setSpecialization(defaultDoctorSpecialization);
            doctorRepository.save(doctor);
        }
    }
}
