package speedy.go.speedygo.stationManagement.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {

    public String generateQRCodeBase64(String text) throws WriterException, IOException {
        int width = 300;
        int height = 300;
        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);

        // Convertir le QR Code en BufferedImage
        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        // Convertir l'image en Base64
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "PNG", outputStream);
        byte[] qrCodeBytes = outputStream.toByteArray();

        return Base64.getEncoder().encodeToString(qrCodeBytes); // Retourne l'image en Base64
    }
}
