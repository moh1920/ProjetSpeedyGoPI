package speedy.go.speedygo.DeliveryManagement.Service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.DeliveryManagement.Repository.DeliveryRepository;
import speedy.go.speedygo.DeliveryManagement.model.Delivery;
import speedy.go.speedygo.DeliveryManagement.model.notification;
import speedy.go.speedygo.DeliveryManagement.model.satusnotif;
import speedy.go.speedygo.OrderManagement.OrderRepository;
import speedy.go.speedygo.models.Order;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Delivery assignDeliveryToCourier(Long orderId, String courierId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        User courier = userRepository.findById(courierId)
                .orElseThrow(() -> new RuntimeException("Courier not found"));

        User client = order.getClient();
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setCourier(courier);
        delivery.setClient(client);
        delivery.setStatus("EN_COURS");
        delivery.setDeliveryAddress(order.getDeliveryAddress());
        delivery.setPickupLatitude(order.getPickupLatitude());
        delivery.setPickupLongitude(order.getPickupLongitude());
        delivery.setDeliveryLatitude(order.getDeliveryLatitude());
        delivery.setDeliveryLongitude(order.getDeliveryLongitude());
/*
        delivery.setTrackingNumber(UUID.fromString(UUID.randomUUID().toString()));
*/
        delivery.setPickupTime(LocalDateTime.now());
        delivery.setDeliveryType("Standard");
        delivery.setPaymentStatus("UNPAID");

        Delivery saved = deliveryRepository.save(delivery);

        messagingTemplate.convertAndSendToUser(client.getEmail(), "/notifications", notification.builder().message("Votre commande a été prise en charge par le livreur : " + courier.getLastName() + " " + courier.getFirstName()).status(satusnotif.SUCCESS).orderid(String.valueOf(saved.getId())).build());
        log.info("🚚 Votre commande a été prise en charge par le livreur : " + courier.getLastName() + " " + courier.getFirstName());
        return saved;
    }

    public Delivery updateDeliveryStatus(Long deliveryId, String status) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElse(null);
        if (delivery != null) {
            delivery.setStatus(status);
            return deliveryRepository.save(delivery);
        }
        return null;
    }

    public List<Delivery> getAllDeliveryOfUser(String clientId) {
        return deliveryRepository.findByClientId(clientId);
    }



    public List<Order> getallOrdersnotAssigned() {
        List<Order> allOrders = orderRepository.findAll();
        List<Long> assignedOrderIds = deliveryRepository.findAll().stream()
                .map(Delivery::getOrder)
                .filter(Objects::nonNull)
                .map(Order::getId)
                .collect(Collectors.toList());

        return allOrders.stream()
                .filter(order -> !assignedOrderIds.contains(order.getId()))

                .collect(Collectors.toList());
    }

    public Delivery pickupDelivery(Long deliveryId,String status) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElse(null);
        if (delivery != null) {
            delivery.setStatus(status);
            return deliveryRepository.save(delivery);
        }
        return null;
    }




}


