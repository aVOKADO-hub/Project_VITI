package dep22.mitit_duty_auto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {org.springframework.boot.autoconfigure.http.HttpMessageConvertersAutoConfiguration.class})
public class MititDutyAutoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MititDutyAutoApplication.class, args);
	}

}
