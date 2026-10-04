---
title: "wrkfetch - System Information Fetcher written in Rust"
date: "2026-10-04"
description: Building a lightweight system information fetcher in Rust from scratch to explore system APIs, fast package manager directory scanning, and async GPU querying.
---

# Why I Built My Own System Fetch Tool in Rust (And What I Learned Along the Way)

Let’s be honest: the Linux community has no shortage of system fetch tools. From the classic `neofetch` (and its many modern successors like `fastfetch`), we are spoiled for choice when it comes to displaying our OS, kernel, and RAM usage alongside a cool ASCII logo. 

So, why spend two days writing my own from scratch? 

Meet **`wrkfetch`**—a lightweight, custom system information fetch tool written entirely in Rust. It was born out of a mix of curiosity, a desire to tinker with low-level system APIs, and wanting a fetch tool tailored precisely to how I like things. 

Here is the story of how I built it, the hurdles I faced, and what I learned along the way.

---

## Why Rust?

When choosing a language for a systems-level CLI tool, **Rust** was an easy choice. I wanted something blazing fast, memory-safe without a garbage collector, and backed by a rich ecosystem of crates that could handle the heavy lifting of system inspection.

Instead of writing everything from absolute zero (like raw system calls for everything), Rust’s ecosystem let me stand on the shoulders of giants using crates like:
* **`sysinfo`** for hardware, CPU, memory, and uptime metrics.
* **`wgpu`** for safely querying GPU information across different backends.
* **`colored`** for adding clean ANSI colors to the terminal output.

---

## The Biggest Challenge: Counting 8 Package Managers

One feature I really wanted was a reliable package count. But counting packages isn't as simple as running a single command—different distros use completely different package management systems. I decided `wrkfetch` should support **8 different package managers**: `pacman`, `dpkg`, `rpm`, `flatpak`, `port`, `pkg`, `xbps`, and `nix`.

To do this efficiently, I built a `PackageManager` struct that inspects default database directories directly on the filesystem rather than spawning heavy external shell processes.

Here is a look at how package directories are scanned, including the special handling needed for Flatpak:

```rust
struct PackageManager {
    name: &'static str,
    db_path: &'static str,
}

impl PackageManager {
    fn count_packages(&self) -> Option<usize> {
        let metadata = std::fs::metadata(self.db_path).ok()?;
        if !metadata.is_dir() {
            return None;
        }

        let dir = std::fs::read_dir(self.db_path).ok()?;
        let mut count = 0;

        for entry in dir.flatten() {
            let name = entry.file_name().to_string_lossy().into_owned();

            if name.starts_with('.') || name == "ALPM_DB_VERSION" {
                continue;
            }

            if self.name == "flatpak" {
                if let Ok(mut app_dir) = std::fs::read_dir(entry.path())
                    && app_dir.any(|e| {
                        e.map(|b| b.file_name().to_string_lossy() == "current")
                            .unwrap_or(false)
                    })
                {
                    count += 1;
                }
                continue;
            }

            count += 1;
        }

        if count > 0 { Some(count) } else { None }
    }
}
```

Scanning directories directly made the execution remarkably fast, avoiding the lag you sometimes get from external command wrappers.

---

## Cool Implementation Details

Beyond package counting, building `wrkfetch` gave me a chance to implement a few fun features:

### 1. Asynchronous GPU Fetching via `wgpu`
Getting GPU info across different graphics APIs can be messy. By leveraging `wgpu` and blocking on it using `pollster`, `wrkfetch` safely queries the primary graphics adapter name without crashing the application if drivers misbehave:

```rust
let gpu_info_str = pollster::block_on(async {
    let instance = wgpu::Instance::default();
    let adapters = instance.enumerate_adapters(wgpu::Backends::all());
    adapters
        .first()
        .map(|adapter| adapter.get_info().name)
        .unwrap_or_else(|| "Unknown".to_string()
});
```

### 2. Smart Local IP Discovery
Instead of parsing complex network interface structs, `wrkfetch` uses a neat trick with a UDP socket connected to an external address (like Google's DNS `8.8.8.8:80`) to instantly discover the active local route without actually sending any traffic:

```rust
let local_ip_str = std::net::UdpSocket::bind("0.0.0.0:0")
    .and_then(|socket| socket.connect("8.8.8.8:80").map(|_| socket))
    .and_then(|socket| socket.local_addr())
    .map(|addr| addr.ip().to_string())
    .unwrap_or_else(|_| "Unknown".to_string());
```

### 3. Visual Memory Progress Bar
Instead of just printing numbers, memory usage is rendered as a custom visual block progress bar calculated dynamically based on total vs. used RAM, styled with truecolor gradients.

### 4. The Saturn ASCII Logo
To tie the aesthetic together, I integrated a custom, highly detailed ASCII art graphic of the planet Saturn, aligned neatly alongside the system specs table.

---

## Distribution: Making It Easy with a Makefile

A tool is only as good as its usability. To make building and installing `wrkfetch` seamless, I put together a simple `Makefile` that compiles a release binary and drops it right into `~/.local/bin/`:

```makefile
BINARY_NAME=wrkfetch
LOCAL_BIN_DIR=$(HOME)/.local/bin

.PHONY: all install clean
all: build

build:
	cargo build --release

install: build
	cp target/release/${BINARY_NAME} $(LOCAL_BIN_DIR)/${BINARY_NAME}
	@echo "Installed ${BINARY_NAME} to $(LOCAL_BIN_DIR)/${BINARY_NAME}"

clean: 
	cargo clean
```

With this in place, installation boils down to:
```bash
make
make install
```

---

## Conclusion & What's Next

Spending two weekend days building `wrkfetch` turned out to be an awesome exercise. It deepened my understanding of Rust's error handling, asynchronous blocks, file system iteration, and practical systems programming. 

If you want to check out the source code, contribute, or run it on your own machine, head over to the GitHub repository:

👉 **[GitHub - wxwreak/wrkfetch](https://github.com/wxwreak/wrkfetch)**