<template>
  <div class="bg-slate-900 min-h-screen h-full overflow-hidden text-white flex flex-col">
    <div class="custom-height"></div>

    <div class="max-w-2/3 mx-auto p-4">
    <!-- Section for adding new cryptocurrency proposal -->
    <div class="my-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Input fields for new cryptocurrency proposal -->
        <input 
          v-model="newProposal.icon" 
          type="text" 
          placeholder="Ikona (URL)" 
          class="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
        />
        <input 
          v-model="newProposal.shortcut" 
          type="text" 
          placeholder="Skrót" 
          class="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
        />
        <input 
          v-model="newProposal.name" 
          type="text" 
          placeholder="Nazwa" 
          class="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
        />
      </div>
      <button 
        @click="addProposal" 
        class="mt-4 bg-blue-600 rounded px-4 py-2 text-white w-full"
      >
        Dodaj Propozycję
      </button>
    </div>

    <!-- Displaying cryptocurrency proposals -->
    <div v-if="proposals.length === 0" class="text-center text-gray-400">
      Brak propozycji do wyświetlenia.
    </div>
    <div v-else>
      <div 
        v-for="proposal in proposals" 
        :key="proposal.index"
        class="bg-gray-700 p-4 mb-4 rounded drop-shadow-xl"
      >
        <div class="flex items-center mb-4">
          <!-- Display proposal details -->
          <img :src="proposal.icon" alt="Icon" class="w-10 h-10 mr-4 rounded" />
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <span class="text-lg">{{ proposal.name }} ({{ proposal.shortcut }})</span>
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-400">{{ proposal.likes }} 👍</span>
                <span class="text-sm text-gray-400">{{ proposal.dislikes }} 👎</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Voting buttons -->
        <div class="flex justify-between">
          <button 
            @click="likeProposal(proposal.index)" 
            class="bg-green-600 rounded px-4 py-2 text-white"
          >
            Głosuj Za
          </button>
          <button 
            @click="dislikeProposal(proposal.index)" 
            class="bg-red-600 rounded px-4 py-2 text-white"
          >
            Głosuj Przeciw
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { konkursss_backend } from 'declarations/konkursss_backend/index';
import { userStore } from '../store'; // upewnij się, że ścieżka jest poprawna

const userId = ref('');

// State for new cryptocurrency proposal
const newProposal = ref({
  icon: '',
  shortcut: '',
  name: ''
});

const proposals = ref([]);

// Fetch proposals from backend
const fetchProposals = async () => {
  try {
    const proposalsData = await konkursss_backend.get_all_proposals();
    proposals.value = proposalsData.map((proposal, index) => ({ ...proposal, index }));
    console.log('Proposals fetched:', proposals.value);
  } catch (error) {
    console.error('Failed to fetch proposals:', error);
  }
};

// Add a new proposal
const addProposal = async () => {
  const { icon, shortcut, name } = newProposal.value;
  if (!icon.trim() || !shortcut.trim() || !name.trim()) {
    return;
  }

  try {
    await konkursss_backend.propose_crypto({
      icon,
      shortcut,
      name,
      proposer: userStore.username,
      likes: 0,
      dislikes: 0
    });
    // Clear input fields after submission
    newProposal.value = { icon: '', shortcut: '', name: '' };
    await fetchProposals(); // Refresh the list
  } catch (error) {
    console.error('Failed to add proposal:', error);
  }
};
const userHasLiked = async (poroposalId) => {
  return await konkursss_backend.user_has_liked_proposal(userId.value, poroposalId);
};

// Check if user has disliked a post
const userHasDisliked = async (poroposalId) => {
  return await konkursss_backend.user_has_disliked_proposal(userId.value, poroposalId);
};


// Like a proposal
const likeProposal = async (index) => {
  try {
  const poroposalId = BigInt(index);
  const hasLiked = await userHasLiked(poroposalId);
  const hasDisliked = await userHasDisliked(poroposalId);
  
  if (hasLiked) {
      await konkursss_backend.like_proposal(userId.value, poroposalId);
    } else {
      // If the user disliked the post, remove the dislike and add a like
      if (hasDisliked) {
        await konkursss_backend.dislike_proposal(userId.value, poroposalId);
      }
      await konkursss_backend.like_proposal(userId.value, poroposalId);
    }
    await fetchProposals();
  } catch (error) {
    console.error('Failed to like proposal:', error);
  }
};

// Dislike a proposal
const dislikeProposal = async (index) => {
  try {
  const poroposalId = BigInt(index);
  const hasLiked = await userHasLiked(poroposalId);
  const hasDisliked = await userHasDisliked(poroposalId);
  
  if (hasDisliked) {
      await konkursss_backend.dislike_proposal(userId.value, poroposalId);
    } else {
      // If the user disliked the post, remove the dislike and add a like
      if (hasLiked) {
        await konkursss_backend.like_proposal(userId.value, poroposalId);
      }
      await konkursss_backend.dislike_proposal(userId.value, poroposalId);
    }
    await fetchProposals();
  } catch (error) {
    console.error('Failed to dislike proposal:', error);
  }
};

// Fetch proposals on component mount
onMounted(fetchProposals);
</script>

<style>
.custom-height {
  height: 20vh; /* Adjust the value based on your needs */
}
</style>