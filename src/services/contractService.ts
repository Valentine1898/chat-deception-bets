import { Contract, BrowserProvider, parseEther } from "ethers";

const CONTRACT_ADDRESS = "0x882Ad45B2C1609c93F3d138802f0f557633b00fc";

const CONTRACT_ABI = [
  {
    "inputs": [{"name": "bet", "type": "uint256"}],
    "name": "createGame",
    "outputs": [{"name": "", "type": "uint32"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "gameId", "type": "uint32"}],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "gameId", "type": "uint32"}, {"name": "guessId", "type": "uint8"}],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_BET",
    "outputs": [{"name": "", "type": "uint128"}],
    "stateMutability": "view",
    "type": "function"
  }
];

class ContractService {
  private contract: Contract | null = null;
  private provider: BrowserProvider | null = null;

  async init(provider: any) {
    this.provider = new BrowserProvider(provider);
    this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, await this.provider.getSigner());
  }

  async createGame(betAmount: string) {
    if (!this.contract) throw new Error("Contract not initialized");
    
    console.log("Creating game with bet:", betAmount);
    const tx = await this.contract.createGame(parseEther(betAmount), {
      value: parseEther(betAmount)
    });
    
    const receipt = await tx.wait();
    console.log("Game created:", receipt);
    
    // Find GameCreated event and get gameId
    const event = receipt.logs.find((log: any) => 
      log.topics[0] === "0x48c63a2766cb910ba33c51568f49d86480f13c99942424849a094ff86b2ec461"
    );
    
    if (!event) throw new Error("GameCreated event not found");
    
    // Parse gameId from event
    const gameId = parseInt(event.topics[1], 16);
    return gameId;
  }

  async joinGame(gameId: number, betAmount: string) {
    if (!this.contract) throw new Error("Contract not initialized");
    
    console.log("Joining game:", gameId, "with bet:", betAmount);
    const tx = await this.contract.joinGame(gameId, {
      value: parseEther(betAmount)
    });
    
    const receipt = await tx.wait();
    console.log("Joined game:", receipt);
    return receipt;
  }

  async vote(gameId: number, guessId: number) {
    if (!this.contract) throw new Error("Contract not initialized");
    
    console.log("Voting in game:", gameId, "with guess:", guessId);
    const tx = await this.contract.vote(gameId, guessId);
    
    const receipt = await tx.wait();
    console.log("Vote submitted:", receipt);
    return receipt;
  }

  async getMinBet() {
    if (!this.contract) throw new Error("Contract not initialized");
    const minBet = await this.contract.MIN_BET();
    return minBet.toString();
  }
}

export const contractService = new ContractService();