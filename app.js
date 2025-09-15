class PositivityAnalyzer {
  constructor() {
    this.positiveWords = [
      'achieve','success','grow','improve','excel','thrive','flourish','prosper',
      'accomplish','master','overcome','conquer','triumph','victory','win',
      'create','build','develop','enhance','optimize','maximize','boost',
      'amazing','fantastic','excellent','outstanding','remarkable','incredible',
      'inspiring','motivating','empowering','uplifting','energizing','exciting',
      'passionate','determined','confident','focused','committed','dedicated',
      'love','enjoy','appreciate','grateful','thankful','blessed','fortunate',
      'positive','optimistic','hopeful','bright','brilliant','wonderful',
      'transform','revolutionize','innovate','pioneer','breakthrough','advance'
    ];
    
    this.negativeWords = [
      'fail','failure','impossible','never',"can't","won't","shouldn't",
      'difficult','hard','struggle','problem','issue','challenge','obstacle',
      'worry','fear','anxiety','stress','pressure','burden','overwhelm',
      'tired','exhausted','burnt','frustrated','annoyed','angry','upset',
      'boring','dull','mundane','tedious','pointless','useless','worthless',
      'hate','dislike','avoid','prevent','stop','quit','give up',
      'terrible','awful','horrible','bad','worst','disappointing'
    ];

    this.neutralWords = [
      'need','want','should','could','would','might','maybe','perhaps',
      'try','attempt','consider','think','plan','intend','hope',
      'work','do','make','get','take','go','come','see'
    ];

    this.goals = JSON.parse(localStorage.getItem('positivityGoals') || '[]');
    this.initializeElements();
    this.attachEventListeners();
    this.renderGoals();
    this.updateStats();
    this.createFloatingParticles();
  }

  initializeElements() {
    this.goalInput = document.getElementById('goalInput');
    this.addGoalBtn = document.getElementById('addGoal');
    this.positivityScore = document.getElementById('positivityScore');
    this.positivityLabel = document.getElementById('positivityLabel');
    this.currentFeedback = document.getElementById('currentFeedback');
    this.totalGoals = document.getElementById('totalGoals');
    this.positiveGoals = document.getElementById('positiveGoals');
    this.avgScore = document.getElementById('avgScore');
    this.goalsList = document.getElementById('goalsList');
    this.feedbackTitle = document.getElementById('feedbackTitle');
    this.feedbackMessage = document.getElementById('feedbackMessage');
  }

  attachEventListeners() {
    this.goalInput.addEventListener('input', () => this.analyzeCurrentInput());
    this.addGoalBtn.addEventListener('click', () => this.addGoal());
    this.goalInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.addGoal();
      }
    });
  }

  analyzeText(text) {
    if (!text.trim()) return { score: 50, sentiment: 'neutral' };

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0, negativeCount = 0, neutralCount = 0;

    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (this.positiveWords.includes(cleanWord)) positiveCount++;
      else if (this.negativeWords.includes(cleanWord)) negativeCount++;
      else if (this.neutralWords.includes(cleanWord)) neutralCount++;
    });

    let rawScore = (positiveCount - negativeCount) * 10 + 50;
    rawScore = Math.max(0, Math.min(100, rawScore));

    let sentiment = 'neutral';
    if (rawScore > 60) sentiment = 'positive';
    else if (rawScore < 40) sentiment = 'negative';

    return { score: rawScore, sentiment, positiveCount, negativeCount, neutralCount };
  }

  analyzeCurrentInput() {
    const text = this.goalInput.value;
    const analysis = this.analyzeText(text);
    this.updateMeter(analysis);
    this.updateFeedback(analysis);
  }

  updateMeter({ score, sentiment }) {
    this.positivityScore.textContent = score;
    this.positivityLabel.textContent = sentiment.toUpperCase();
    this.positivityLabel.style.color = 
      sentiment === 'positive' ? '#10b981' : 
      sentiment === 'negative' ? '#ef4444' : '#f59e0b';
    this.positivityScore.style.color = this.positivityLabel.style.color;
  }

  updateFeedback({ score, sentiment }) {
    const feedbackMessages = {
      positive: [
        { title: "🌟 Fantastic Positivity!", 
          message: "Your goal is radiating positive energy! This strong positive framing will boost your motivation and increase your chances of success." },
        { title: "💎 Brilliant Framing!", 
          message: "This goal shines with positive intention. Keep expressing your goals with such clarity and optimism!" }
      ],
      neutral: [
        { title: "⚖️ Balanced Approach", 
          message: "You're on the right track! Try adding more positive, action-oriented words like 'achieve', 'grow', or 'create'." },
        { title: "✨ Room for Growth", 
          message: "Neutral goals are fine, but adding more positive, empowering words can significantly boost your motivation." }
      ],
      negative: [
        { title: "🚫 Negative Alert", 
          message: "Consider reframing your goal in positive terms. Instead of focusing on what you don't want, emphasize what you want to achieve." },
        { title: "🌈 Reframe Opportunity", 
          message: "Your goal contains negative words. Try rephrasing with positive alternatives to make it more motivating and achievable." }
      ]
    };

    const feedback = feedbackMessages[sentiment][Math.floor(Math.random() * 2)];
    this.feedbackTitle.textContent = feedback.title;
    this.feedbackMessage.textContent = feedback.message;

    this.currentFeedback.textContent = 
      sentiment === 'positive' ? "Great job! Your goal radiates positive energy ✨" :
      sentiment === 'negative' ? "Try reframing your goal with more positive language 💡" :
      "You're on the right path! Add more positive words for greater impact 🌟";

    this.currentFeedback.style.color = 
      sentiment === 'positive' ? '#10b981' :
      sentiment === 'negative' ? '#ef4444' : '#f59e0b';
  }

  addGoal() {
    const text = this.goalInput.value.trim();
    if (!text) return;

    const analysis = this.analyzeText(text);
    const newGoal = {
      id: Date.now(),
      text,
      ...analysis,
      date: new Date().toISOString()
    };

    this.goals.unshift(newGoal);
    localStorage.setItem('positivityGoals', JSON.stringify(this.goals));
    this.goalInput.value = '';
    
    this.renderGoals();
    this.updateStats();
    this.updateMeter(analysis);
    this.updateFeedback(analysis);
  }

  deleteGoal(id) {
    this.goals = this.goals.filter(goal => goal.id !== id);
    localStorage.setItem('positivityGoals', JSON.stringify(this.goals));
    this.renderGoals();
    this.updateStats();
  }

  renderGoals() {
    this.goalsList.innerHTML = this.goals.map(goal => `
      <div class="goal-item ${goal.sentiment}">
        <div class="goal-text">${goal.text}</div>
        <div class="goal-meta">
          <span class="goal-date">${new Date(goal.date).toLocaleDateString()}</span>
          <span class="positivity-badge badge-${goal.sentiment}">
            ${goal.score} - ${goal.sentiment}
          </span>
          <button class="delete-btn" onclick="app.deleteGoal(${goal.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }

  updateStats() {
    const total = this.goals.length;
    const positives = this.goals.filter(g => g.sentiment === 'positive').length;
    const avgScore = total ? Math.round(this.goals.reduce((acc, g) => acc + g.score, 0) / total) : 0;

    this.totalGoals.textContent = total;
    this.positiveGoals.textContent = positives;
    this.avgScore.textContent = avgScore;
  }

  createFloatingParticles() {
    const container = document.querySelector('.floating-particles');
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${10 + Math.random() * 20}s`;
      particle.style.animationDelay = `${Math.random() * 20}s`;
      container.appendChild(particle);
    }
  }
}

const app = new PositivityAnalyzer();
