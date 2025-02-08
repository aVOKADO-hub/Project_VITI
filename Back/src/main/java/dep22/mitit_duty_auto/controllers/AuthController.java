package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.dto.UserInfoDto;
import dep22.mitit_duty_auto.dto.UserRegistrationDto;
import dep22.mitit_duty_auto.entities.security.User;
import dep22.mitit_duty_auto.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto registrationDto) {
        return ResponseEntity.ok(userService.register(registrationDto));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Principal principal) {
        if (principal != null) { // Check if principal is not null
            String username = principal.getName();
            User user = userService.findByName(username).orElseThrow();
            return ResponseEntity.ok(new UserInfoDto(user));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Or appropriate response
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.login(), loginRequest.password())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // ***ДОБАВЬТЕ ЭТО***
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Аутентификация после логина: " + auth); // Выводим информацию об аутентификации

            User user = userService.findByName(loginRequest.login()).orElseThrow();
            return ResponseEntity.ok(Map.of("role", user.getRole().name()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    record LoginRequest(String login, String password) {
    }
}