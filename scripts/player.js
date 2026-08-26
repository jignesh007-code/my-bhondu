/**
 * ============================================================================
 * PLAYER.JS - Floating Aesthetic Music Player Controller (Version 3.0)
 * Plays the user's uploaded audio file with Web Audio API fallback.
 * ============================================================================
 */

(function () {
  'use strict';

  // DOM Elements
  const playerWrapper = document.getElementById('floating-music-player');
  const audioElement = document.getElementById('bg-audio');
  const btnToggle = document.getElementById('btn-player-toggle');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const songTitle = document.getElementById('song-title');
  const timeCurrent = document.getElementById('time-current');
  const timeDuration = document.getElementById('time-duration');
  const progressSlider = document.getElementById('progress-slider');
  const progressBarFill = document.getElementById('progress-bar-fill');

  let isPlaying = false;
  let isDragging = false;
  let synthAudioActive = false;
  let synthInterval = null;
  let audioCtx = null;
  let synthTimer = 0;

  /**
   * Format seconds to mm:ss
   */
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  /**
   * Update UI state to playing
   */
  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      if (iconPlay) iconPlay.classList.add('hidden');
      if (iconPause) iconPause.classList.remove('hidden');
      if (playerWrapper) playerWrapper.classList.add('is-playing');
      if (btnToggle) btnToggle.setAttribute('aria-label', 'Pause song');
    } else {
      if (iconPlay) iconPlay.classList.remove('hidden');
      if (iconPause) iconPause.classList.add('hidden');
      if (playerWrapper) playerWrapper.classList.remove('is-playing');
      if (btnToggle) btnToggle.setAttribute('aria-label', 'Play song');
    }
  }

  /**
   * Toggle Track Play / Pause
   */
  function togglePlay() {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  }

  function playTrack() {
    if (synthAudioActive) {
      startSynthPlayback();
      setPlayingState(true);
      return;
    }

    if (audioElement) {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayingState(true);
          })
          .catch((err) => {
            console.warn('Audio playback error or fallback needed:', err);
            synthAudioActive = true;
            if (songTitle) songTitle.textContent = 'gentle chords ♡';
            startSynthPlayback();
            setPlayingState(true);
          });
      }
    } else {
      synthAudioActive = true;
      startSynthPlayback();
      setPlayingState(true);
    }
  }

  function pauseTrack() {
    if (synthAudioActive) {
      stopSynthPlayback();
      setPlayingState(false);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }
    setPlayingState(false);
  }

  /**
   * Real-time progress update
   */
  function updateProgress() {
    if (isDragging) return;

    if (synthAudioActive) {
      synthTimer += 0.25;
      const totalFakeDuration = 180;
      const current = synthTimer % totalFakeDuration;
      const percent = (current / totalFakeDuration) * 100;

      if (timeCurrent) timeCurrent.textContent = formatTime(current);
      if (timeDuration) timeDuration.textContent = formatTime(totalFakeDuration);
      if (progressSlider) progressSlider.value = percent;
      if (progressBarFill) progressBarFill.style.width = `${percent}%`;
      return;
    }

    if (!audioElement || isNaN(audioElement.duration)) return;

    const current = audioElement.currentTime;
    const duration = audioElement.duration;
    const percent = (current / duration) * 100;

    if (timeCurrent) timeCurrent.textContent = formatTime(current);
    if (timeDuration) timeDuration.textContent = formatTime(duration);
    if (progressSlider) progressSlider.value = percent;
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;
  }

  /**
   * Scrubber input handlers
   */
  function handleSliderInput() {
    isDragging = true;
    const percent = progressSlider.value;
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;

    if (!synthAudioActive && audioElement && !isNaN(audioElement.duration)) {
      const seekTime = (percent / 100) * audioElement.duration;
      if (timeCurrent) timeCurrent.textContent = formatTime(seekTime);
    }
  }

  function handleSliderChange() {
    isDragging = false;
    const percent = progressSlider.value;

    if (synthAudioActive) {
      synthTimer = (percent / 100) * 180;
    } else if (audioElement && !isNaN(audioElement.duration)) {
      audioElement.currentTime = (percent / 100) * audioElement.duration;
    }
  }

  /**
   * Web Audio API Fallback Synth
   */
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSoftChord(freqs, duration) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.5);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration - 0.1);
    masterGain.connect(ctx.destination);

    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      noteGain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(noteGain);
      noteGain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    });
  }

  const calmProgression = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];
  let chordIndex = 0;

  function startSynthPlayback() {
    getAudioContext();
    if (synthInterval) clearInterval(synthInterval);

    playSoftChord(calmProgression[chordIndex], 3.8);
    chordIndex = (chordIndex + 1) % calmProgression.length;

    synthInterval = setInterval(() => {
      if (isPlaying) {
        playSoftChord(calmProgression[chordIndex], 3.8);
        chordIndex = (chordIndex + 1) % calmProgression.length;
        updateProgress();
      }
    }, 4000);
  }

  function stopSynthPlayback() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  /**
   * Initialize Audio Listeners
   */
  function initPlayer() {
    if (btnToggle) {
      btnToggle.addEventListener('click', togglePlay);
    }

    if (progressSlider) {
      progressSlider.addEventListener('input', handleSliderInput);
      progressSlider.addEventListener('change', handleSliderChange);
    }

    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateProgress);
      audioElement.addEventListener('loadedmetadata', () => {
        if (!isNaN(audioElement.duration)) {
          if (timeDuration) timeDuration.textContent = formatTime(audioElement.duration);
        }
      });
      audioElement.addEventListener('ended', () => {
        setPlayingState(false);
        if (progressSlider) progressSlider.value = 0;
        if (progressBarFill) progressBarFill.style.width = '0%';
        if (timeCurrent) timeCurrent.textContent = '0:00';
      });
      audioElement.addEventListener('error', (e) => {
        console.warn('Primary audio failed to load. Readying fallback synth...', e);
      });
    }
  }

  // Global interface
  window.ScrapbookPlayer = {
    init: initPlayer,
    play: playTrack,
    pause: pauseTrack,
    toggle: togglePlay,
    show: function () {
      if (playerWrapper) {
        playerWrapper.classList.add('active');
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
  } else {
    initPlayer();
  }
})();
