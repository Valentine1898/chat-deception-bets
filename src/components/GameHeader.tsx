import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const GameHeader = () => {
  return (
    <>
      <Link 
        to="/" 
        className="fixed top-24 left-4 z-50 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Games
      </Link>
      
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/a80f0ac3-8d80-48b2-9d4f-d311f160489f.png" 
          alt="Alan Turing" 
          className="logo w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-foreground mb-2">Turing Arena</h1>
      </div>
    </>
  );
};

export default GameHeader;