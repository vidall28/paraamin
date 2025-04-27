import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/placeholder.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-rose-500/30 backdrop-blur-sm" />
      </div>
      
      <motion.div 
        className="relative text-center max-w-2xl mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="font-serif text-4xl md:text-6xl mb-6">
          Amin, você é meu tudo
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          Minha razão de sorrir todos os dias. Hoje, quero celebrar cada momento ao seu lado.
        </p>
        <motion.button
          className="px-8 py-3 bg-white/10 border-2 border-white rounded-full 
                     font-serif text-lg hover:bg-white hover:text-rose-600 
                     transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            document.getElementById('album')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Ver Álbum
        </motion.button>
      </motion.div>
    </div>
  );
}
