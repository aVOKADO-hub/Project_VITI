package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.dto.UserInfoDto;
import dep22.mitit_duty_auto.dto.UserRegistrationDto;
import dep22.mitit_duty_auto.entities.security.User;
import dep22.mitit_duty_auto.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
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
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto registrationDto) {
        return ResponseEntity.ok(userService.register(registrationDto));
    }

     @GetMapping("/me")
     public ResponseEntity<?> getMe(Principal principal) {
         String username = principal.getName();
         User user = userService.findByName(username).orElseThrow();
         return ResponseEntity.ok(new UserInfoDto(user));
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
                    new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.findByName(loginRequest.getLogin()).orElseThrow();
            return ResponseEntity.ok(Map.of("role", user.getRole().name())); // Возвращаем роль пользователя
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Возвращаем 401 Unauthorized
        }
    }

    record LoginRequest(String login, String password) {
        public String getLogin() {
            return login;
        }

        public String getPassword() {
            return password;
        }
    }
}