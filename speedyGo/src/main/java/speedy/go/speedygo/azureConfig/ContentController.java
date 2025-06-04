package speedy.go.speedygo.azureConfig;

import com.azure.ai.contentsafety.models.AnalyzeTextResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/azure/content")
public class ContentController {
    private final ContentSafetyService contentSafetyService;

    public ContentController(ContentSafetyService contentSafetyService) {
        this.contentSafetyService = contentSafetyService;
    }

    @PostMapping("/analyze")
    public AnalyzeTextResult analyzeContent(@RequestBody String text) {
        return contentSafetyService.analyzeText(text);
    }
}
