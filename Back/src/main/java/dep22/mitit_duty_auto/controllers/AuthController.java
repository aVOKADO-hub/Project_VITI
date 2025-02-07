package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.dto.UserInfoDto;
import dep22.mitit_duty_auto.dto.UserRegistrationDto;
import dep22.mitit_duty_auto.entities.security.User;
import dep22.mitit_duty_auto.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

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
}