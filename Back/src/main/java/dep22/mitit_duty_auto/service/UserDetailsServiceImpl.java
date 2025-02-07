package dep22.mitit_duty_auto.service;

import dep22.mitit_duty_auto.entities.security.User;
import dep22.mitit_duty_auto.repos.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getName(),
                user.getPassword(),
                mapRolesToAuthorities(user.getRole())
        );
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(dep22.mitit_duty_auto.entities.security.Roles role) {
        System.out.println("==Log--mapRolesToAuthorities== " + role);
        for (SimpleGrantedAuthority simpleGrantedAuthority : List.of(new SimpleGrantedAuthority(role.name()))) {
            System.out.println(simpleGrantedAuthority.getAuthority());
        }
        if (role == null) {
            return List.of();
        }
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
}