```go
type identity struct {
        Name       string
        Focus      []string
        Mission    string
}

var Identity = identity{
        Name:       "wxwreak",
        Focus:      []string{"Systems Programming", "Security Tooling", "Linux Internals"},
        Mission:    "Building Systems // Writing Security Tools // Living in Terminal",
}
```
<br>

```go
type links struct {
        Portfolio  string
        TryHackMe  string
        Twitter    string
        DevTo      string
        Reddit     string
}

var Links = links{
        Portfolio:  "https://wxwreak.vercel.app",
        TryHackMe:  "https://tryhackme.com/p/wxwreak",
        Twitter:    "https://x.com/wxwreak",
        DevTo:      "https://dev.to/wxwreak",
        Reddit:     "https://www.reddit.com/user/wxwreak",
}
```

<br>

```go
type techstack struct {
        Stack      []string
        Sec        []string
        Role       []string
        Driver     string
        HomeLab    string
}

var TechStack = techstack{
        Stack:     []string{"Linux", "Python", "Go", "Docker", "Git"},
        Sec:       []string{"OffSec Mindset", "Ad-hoc Vulnerability Hunting"},
        Role:      []string{"Systems Programmer", "Backend & Security Tool Developer"},
        Driver:    "Fedora Linux",
        HomeLab:   "Raspberry Pi",
}
```