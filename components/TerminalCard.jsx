export function handleTerminalReq(userAgent) {
    if (!userAgent || !userAgent.toLowerCase().includes("curl")) {
        return null;
    }

    const boldGreen = "\x1b[1;32m";
    const green = "\x1b[32m";
    const white = "\x1b[37m";
    const gray = "\x1b[90m";
    const cyan = "\x1b[36m";
    const reset = "\x1b[0m";
    const width = 65;
    const formatRow = (text) => {
        const ansiRegex = /\x1b\[[0-9;]*m/g;
        const visibleLength = text.replace(ansiRegex, "").length;
        const padding = " ".repeat(Math.max(0, width - visibleLength));
        return `    │  ${text}${padding}  │\n`;
    };

    let card = `\n    ┌${"─".repeat(width + 4)}┐\n`;
    card += formatRow(`${boldGreen}wxwreak${reset}`);
    card += formatRow(`${gray}Systems Programmer // Security Tool Developer${reset}`);
    card += formatRow("");
    card += formatRow(`${gray}Focus:${reset}    ${white}Linux Internals, Security Tooling, Go, Py${reset}`);
    card += formatRow(`${gray}OS/Env:${reset}   ${white}CachyOS, Raspberry Pi HomeLab${reset}`);
    card += formatRow("");
    card += formatRow(`${gray}GitHub:${reset}   ${green}https://github.com/wxwreak${reset}`);
    card += formatRow(`${gray}Portfolio:${reset}${cyan}https://wxwreak.vercel.app${reset}`);
    card += formatRow(`${gray}TryHackMe:${reset}${cyan}https://tryhackme.com/p/wxwreak${reset}`);
    card += `    └${"─".repeat(width + 4)}┘\n\n`;

    return new Response(card, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store, max-age=0" 
        },
    });
}
