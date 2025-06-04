package speedy.go.speedygo.googleAnalyseSentimentConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.cloud.vision.v1.*;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.Image;
import com.google.protobuf.ByteString;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleAnalyser {
  /*  public float analyzeSentiment(String textContent) throws Exception {
        try (LanguageServiceClient language = LanguageServiceClient.create()) {
            Document doc = Document.newBuilder().setContent(textContent).setType(Document.Type.PLAIN_TEXT).build();
            Sentiment sentiment = language.analyzeSentiment(doc).getDocumentSentiment();
            return sentiment.getScore();
        }
    }


    public boolean analyzeImage(String imageUrl) throws Exception {
        // Créer le client pour l'API Google Vision
        ImageAnnotatorClient vision = ImageAnnotatorClient.create();

        // Lire l'image depuis l'URL
        ByteString imgBytes = ByteString.readFrom(new URL(imageUrl).openStream());
        Image img = Image.newBuilder().setContent(imgBytes).build();

        // Créer la demande d'analyse
        List<AnnotateImageRequest> requests = new ArrayList<>();
        requests.add(AnnotateImageRequest.newBuilder().setImage(img).addFeatures(Feature.newBuilder().setType(Feature.Type.FACE_DETECTION).build()).build());

        // Envoyer la demande à l'API
        BatchAnnotateImagesResponse response = vision.batchAnnotateImages(requests);

        // Fermer la connexion
        vision.close();

        // Analyser la réponse
        boolean analysisResult = false;

        if (!response.getResponsesList().isEmpty()) {
            AnnotateImageResponse res = response.getResponsesList().get(0);

            // Vérifier s'il y a des annotations de visages
            if (res.getFaceAnnotationsList().size() > 0) {
                for (FaceAnnotation face : res.getFaceAnnotationsList()) {
                    // Vérifier les émotions détectées
                    if (face.getJoyLikelihood() == Likelihood.VERY_UNLIKELY || face.getSorrowLikelihood() == Likelihood.VERY_LIKELY) {
                        analysisResult = true;
                    } else {
                        analysisResult = false;
                    }
                }
            } else {
                analysisResult = false;
            }
        }

        return analysisResult;
    }*/

    private static final String API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
    private static final String TOKEN = "Bearer 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";

    private final RestTemplate restTemplate;

    public GoogleAnalyser(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Cette méthode n'est pas statique
    public String analyzeSentiment(String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", TOKEN);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("inputs", text);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, String.class);
            return response.getBody();
        } catch (Exception e) {
            return "Erreur lors de l'appel à Hugging Face: " + e.getMessage();
        }
    }
}