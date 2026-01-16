## deviconnelinux

- DevilConnection running on Linux x86_64, **with intact app.asar.**
- Also **desktop entry is set,** so you can launch the game from application launcher.

## installation

- copy config.sh.sample to config.sh, fill APP_ASAR path (and optionally INSTALL_DIR), then run install.sh

## running

- launch INSTALL_DIR/electron or select devilconnection in application launcher, but **make sure Steam is running background.**

## disclaimer

- Though I have completed true ending and epilogue, I'm still not resposible for any troubles.
- Also this is **unofficial build,** so when you report bugs you should reproduce on Windows or macOS.

## caveats

### arm64

Steam SDK started to support Linux arm64 only from 1.63 (2025 Nov). steamworks.js needs to be rebuilt, but it does not look working...

### the data directory

- electron_latest_patched.js, blob_patched.js and devilconnection.png are _copyrighted materials._
- The icon was extracted from demo version exe, so it is not paid material at least, but if it has issues I would remove.
