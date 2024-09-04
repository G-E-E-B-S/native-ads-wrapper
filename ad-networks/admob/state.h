#ifndef STATE_H
#define STATE_H
enum State {
  kNotInitialized,
  kInitialized,
  kNotLoaded,
  kLoaded,
  kLoadPending,
  kShowing,
  kShowPending,
};
#endif // STATE_H
