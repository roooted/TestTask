<template>
  <div class="review-result">
    <div class="result-header">
      <StatusBadge :status="review.status" />
      <span class="time">⏱️ {{ review.responseTime }}ms</span>
    </div>

    <div class="score">
      <ScoreCircle :score="review.score" />
      <p class="score-label">Overall Code Quality</p>
    </div>

    <FeedbackSection :feedback="review.feedback" />
    <SuggestionsList :suggestions="review.suggestions" />
    <IssuesList :issues="review.issues" />
  </div>
</template>

<script setup>
/**
 * Wrapper for displaying the full review result.
 * Props:
 *   review: Object containing status, score, responseTime, feedback, suggestions, issues
 */
import { defineProps } from 'vue';
import StatusBadge from './StatusBadge.vue';
import ScoreCircle from './ScoreCircle.vue';
import FeedbackSection from './FeedbackSection.vue';
import SuggestionsList from './SuggestionsList.vue';
import IssuesList from './IssuesList.vue';

const props = defineProps({
  review: { type: Object, required: true }
});
</script>

<style scoped>
/* Reuse review-result styles from App.vue */
</style>

