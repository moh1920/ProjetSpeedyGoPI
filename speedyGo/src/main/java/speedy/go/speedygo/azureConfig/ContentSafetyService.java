package speedy.go.speedygo.azureConfig;

import com.azure.ai.contentsafety.ContentSafetyClient;
import com.azure.ai.contentsafety.ContentSafetyClientBuilder;
import com.azure.ai.contentsafety.models.AnalyzeTextOptions;
import com.azure.ai.contentsafety.models.AnalyzeTextResult;
import com.azure.core.credential.AzureKeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ContentSafetyService {
    private final ContentSafetyClient contentSafetyClient;
    public ContentSafetyService(
            @Value("${azure.ai.contentsafety.endpoint}") String endpoint,
            @Value("${azure.ai.contentsafety.api-key}") String apiKey) {
        this.contentSafetyClient = new ContentSafetyClientBuilder()
                .endpoint(endpoint)
                .credential(new AzureKeyCredential(apiKey))
                .buildClient();
    }

    public AnalyzeTextResult analyzeText(String text) {
        AnalyzeTextOptions options = new AnalyzeTextOptions(text);
        return contentSafetyClient.analyzeText(options);
    }
}
