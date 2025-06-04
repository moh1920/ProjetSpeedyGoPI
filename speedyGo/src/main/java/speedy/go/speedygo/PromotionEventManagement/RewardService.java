package speedy.go.speedygo.PromotionEventManagement;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class RewardService {
    private final RewardRepository rewardRepository;

    public Reward saveReward(String reward){

        return rewardRepository.save(Reward.builder().rewordName(reward).build());
    }


    public List<String> getRewards() {
        return rewardRepository.findAll().stream().map(Reward::getRewordName).toList();
    }

    private static final Random RANDOM = new Random();

    public String getRandomReward() {
        List<String> rewards = getRewards();

        if (rewards.isEmpty()) {
            throw new IllegalStateException("No rewards available");
        }

        List<String> mutableRewards = new ArrayList<>(rewards);

        for (int i = mutableRewards.size() - 1; i > 0; i--) {
            int j = RANDOM.nextInt(i + 1);
            String temp = mutableRewards.get(i);
            mutableRewards.set(i, mutableRewards.get(j));
            mutableRewards.set(j, temp);
        }

        return mutableRewards.get(0);
    }

    @Scheduled(cron = "0 0 0 ? * WED")
    public void deleteRewords(){
        rewardRepository.deleteAll();
    }


}
