package speedy.go.speedygo.models;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import speedy.go.speedygo.models.Product;

import java.io.IOException;

public class ProductSerializer extends JsonSerializer<Product> {

    @Override
    public void serialize(Product product, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("product_id", product.getId().toString());  // sérialiser l'ID du produit
        gen.writeStringField("product_name", product.getName());  // sérialiser le nom du produit
        gen.writeNumberField("product_price", product.getPrice());  // sérialiser le prix du produit
        gen.writeEndObject();
    }
}
