package speedy.go.speedygo.configuration;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dpvqw1nd4",
                "api_key", "856591911111161",
                "api_secret", "1JfmQN2QwIVES5bE-tBXrXB8ojA",
                "secure", true
        ));
    }
}
