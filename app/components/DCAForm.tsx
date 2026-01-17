"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./DCAForm.module.css";

type Token = {
  symbol: string;
  name: string;
  image?: string;
  address: string;
  decimals?: number;
};

type DCAPlan = {
  id: string;
  amount: string;
  currency: Token;
  target: Token;
  frequency: string;
  createdAt: number;
};

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

// Default "Recommended" tokens to show initially (Pinned)
const PINNED_TOKENS: Token[] = [
  { symbol: "ETH", name: "Ether", address: "0x4200000000000000000000000000000000000006", image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { symbol: "USDC", name: "USD Coin", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", image: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png" },
  { symbol: "WETH", name: "Wrapped Ether", address: "0x4200000000000000000000000000000000000006", image: "https://assets.coingecko.com/coins/images/2518/small/weth.png" },
  { symbol: "BRETT", name: "Brett", address: "0x532f27101965dd16442e59d40670faf5ebb142e4", image: "https://assets.coingecko.com/coins/images/35566/small/brett.png" },
  { symbol: "DEGEN", name: "Degen", address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed", image: "https://assets.coingecko.com/coins/images/34515/small/degen.png" },
];

export default function DCAForm() {
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");
  const [plans, setPlans] = useState<DCAPlan[]>([]);

  // Form State
  const [amount, setAmount] = useState<string>("10");
  const [currency, setCurrency] = useState<Token>(PINNED_TOKENS[1]); // USDC default
  const [targetToken, setTargetToken] = useState<Token>(PINNED_TOKENS[0]); // ETH default
  const [frequency, setFrequency] = useState<string>("daily");
  const [isLoading, setIsLoading] = useState(false);

  // Token List State
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [isFetchingTokens, setIsFetchingTokens] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"currency" | "target">("target");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Tokens on Mount
  useEffect(() => {
    const fetchTokens = async () => {
      setIsFetchingTokens(true);
      try {
        const response = await fetch("https://tokens.coingecko.com/base/all.json");
        const data = await response.json();
        
        // Transform CoinGecko format to our Token type
        const fetchedTokens: Token[] = data.tokens.map((t: any) => ({
          symbol: t.symbol,
          name: t.name,
          image: t.logoURI,
          address: t.address,
          decimals: t.decimals
        }));

        setAllTokens(fetchedTokens);
      } catch (error) {
        console.error("Failed to fetch token list:", error);
      } finally {
        setIsFetchingTokens(false);
      }
    };

    fetchTokens();
  }, []);

  const filteredTokens = useMemo(() => {
    let tokensToSearch = allTokens.length > 0 ? allTokens : PINNED_TOKENS;

    // If no search query, prioritize PINNED_TOKENS at the top, then show others
    if (!searchQuery) {
        // Create a Set of pinned addresses to avoid duplicates
        const pinnedAddresses = new Set(PINNED_TOKENS.map(t => t.address.toLowerCase()));
        const otherTokens = allTokens.filter(t => !pinnedAddresses.has(t.address.toLowerCase()));
        return [...PINNED_TOKENS, ...otherTokens.slice(0, 100)]; // Limit to +100 to avoid lag
    }

    // Search logic
    const lowerQuery = searchQuery.toLowerCase();
    return tokensToSearch.filter(
      (t) =>
        t.symbol.toLowerCase().includes(lowerQuery) ||
        t.name.toLowerCase().includes(lowerQuery) ||
        t.address.toLowerCase() === lowerQuery
    ).slice(0, 50); // Limit results for performance
  }, [allTokens, searchQuery]);

  const openTokenModal = (type: "currency" | "target") => {
    setSelectingFor(type);
    setSearchQuery("");
    setIsModalOpen(true);
  };

  const handleSelectToken = (token: Token) => {
    if (selectingFor === "currency") {
      setCurrency(token);
    } else {
      setTargetToken(token);
    }
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate creation
    setTimeout(() => {
      const newPlan: DCAPlan = {
        id: Math.random().toString(36).substr(2, 9),
        amount,
        currency,
        target: targetToken,
        frequency,
        createdAt: Date.now(),
      };
      
      setPlans((prev) => [newPlan, ...prev]);
      setActiveTab("list"); // Switch to list view
      setIsLoading(false);
      // Reset form defaults if needed, but keeping them is often better UX
    }, 1000);
  };

  const handleCancelPlan = (id: string) => {
    if (confirm("Are you sure you want to cancel this DCA plan?")) {
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 className={styles.title} style={{ margin: 0 }}>Auto-Invest Monitor</h2>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            background: "rgba(0, 82, 255, 0.15)", 
            padding: "6px 10px", 
            borderRadius: "12px",
            border: "1px solid rgba(0, 82, 255, 0.2)"
          }}>
             <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0052FF" }}></div>
             <span style={{ color: "#0052FF", fontWeight: 700, fontSize: "0.8rem" }}>Base</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "create" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Create Plan
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "list" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("list")}
          >
            Active Plans {plans.length > 0 && `(${plans.length})`}
          </button>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Create Plan Form */}
          {activeTab === "create" && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Amount Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Invest Amount</label>
                <div className={styles.inputRow}>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={styles.input}
                    placeholder="0.00"
                    min="0"
                    step="any"
                    required
                  />
                  
                  <button
                    type="button"
                    className={styles.select}
                    onClick={() => openTokenModal("currency")}
                  >
                    {currency.image && (
                       <img src={currency.image} alt={currency.symbol} width={20} height={20} style={{borderRadius: "50%"}} />
                    )}
                    {currency.symbol}
                    <span style={{opacity: 0.5, fontSize: "0.8rem"}}>▼</span>
                  </button>
                </div>
              </div>

              {/* Target Token Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Buy Asset</label>
                <div className={styles.fullSelect} onClick={() => openTokenModal("target")} style={{cursor: "pointer", display: "flex", alignItems: "center"}}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {targetToken.image ? (
                         <img src={targetToken.image} alt={targetToken.symbol} width={28} height={28} style={{borderRadius: "50%"}} />
                      ) : (
                        <div className={styles.tokenIcon} style={{width: 28, height: 28, fontSize: "0.8rem"}}>{targetToken.symbol[0]}</div>
                      )}
                      <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>{targetToken.symbol}</span>
                    </div>
                    <span style={{ opacity: 0.5 }}>▼</span>
                </div>
              </div>

              {/* Frequency Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Frequency</label>
                <div className={styles.inputRow}>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className={styles.frequencySelect}
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>
                        Every {f.label}
                      </option>
                    ))}
                  </select>
                  <span style={{opacity: 0.5}}>▼</span>
                </div>
              </div>

              <div className={styles.summary} style={{ marginTop: "auto" }}>
                Investing <span className={styles.highlight}>{amount} {currency.symbol}</span> to buy{" "}
                <span className={styles.highlight}>{targetToken.symbol}</span> every{" "}
                <span className={styles.highlight}>{frequency}</span>
              </div>

              <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? "Confirming..." : "Start Auto-Invest"}
              </button>
            </form>
          )}

          {/* My Plans List */}
          {activeTab === "list" && (
            <div className={styles.planList} style={{ height: "100%" }}>
              {plans.length === 0 ? (
                <div className={styles.emptyState} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{fontSize: "2rem", marginBottom: "12px"}}>charts</div>
                  No active plans found.
                  <br/>
                  <span style={{fontSize: "0.85rem", opacity: 0.7}}>Create a plan to start automating your investments.</span>
                </div>
              ) : (
                plans.map((plan) => (
                  <div key={plan.id} className={styles.planCard}>
                    <div className={styles.planCardRow}>
                      <div className={styles.planTokenInfo}>
                        {plan.target.image ? (
                          <img src={plan.target.image} width={32} height={32} style={{borderRadius:"50%"}} />
                        ) : (
                          <div style={{width:32, height:32, background:"#333", borderRadius:"50%"}} />
                        )}
                        <div>
                          <div style={{fontWeight: 700, fontSize: "1rem"}}>{plan.target.symbol}</div>
                          <div style={{fontSize: "0.8rem", color: "#888", marginTop: "2px"}}>via {plan.currency.symbol}</div>
                        </div>
                      </div>
                      <div style={{textAlign: "right"}}>
                         <div className={styles.planAmount}>{plan.amount}</div>
                         <div className={styles.planFrequency}>{plan.frequency}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleCancelPlan(plan.id)}
                      className={styles.cancelPlanBtn}
                    >
                      Stop Auto-Invest
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Token Selection Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Select Token</h3>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search name or contract address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className={styles.tokenList}>
                {isFetchingTokens && !allTokens.length ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>Loading tokens...</div>
                ) : (
                    filteredTokens.map((token, index) => (
                  <button
                    key={`${token.address}-${index}`}
                    className={styles.tokenItem}
                    onClick={() => handleSelectToken(token)}
                  >
                    {token.image ? (
                       <img src={token.image} alt={token.symbol} className={styles.tokenIcon} />
                    ) : (
                      <div className={styles.tokenIcon}>{token.symbol[0]}</div>
                    )}
                    <div className={styles.tokenInfo}>
                      <span className={styles.tokenSymbol}>{token.symbol}</span>
                      <span className={styles.tokenName}>{token.name}</span>
                    </div>
                  </button>
                ))
                )}
                
                {filteredTokens.length === 0 && !isFetchingTokens && (
                  <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
                    No tokens found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
