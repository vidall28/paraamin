import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function Timeline() {
  const events = useQuery(api.timeline.listEvents) ?? [];
  const addEvent = useMutation(api.timeline.addEvent);
  const [isAdding, setIsAdding] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await addEvent({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        date: new Date(formData.get("date") as string).getTime(),
        type: formData.get("type") as "event" | "motivation",
      });
      setIsAdding(false);
      form.reset();
      toast.success("Evento adicionado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao adicionar evento");
    }
  }

  return (
    <section className="py-16 px-4 bg-rose-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif text-rose-600">Nossa Jornada</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 
                     rounded-full transition-colors duration-200"
          >
            Adicionar Evento
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 -ml-px h-full w-0.5 bg-rose-200" />

          <div className="space-y-12">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-start ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`relative w-1/2 ${
                    index % 2 === 0 ? "pr-8" : "pl-8"
                  }`}
                >
                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <span className="text-sm text-rose-500">
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </span>
                    <h3 className="mt-2 text-xl font-serif text-gray-900">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-gray-600">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setIsAdding(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg p-6 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-serif text-rose-600 mb-4">
                  Adicionar Novo Evento
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Título
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                               focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                               focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                               focus:border-rose-500 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <select
                      name="type"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                               focus:border-rose-500 focus:ring-rose-500"
                    >
                      <option value="event">Evento</option>
                      <option value="motivation">Motivação</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 text-white rounded-md 
                               hover:bg-rose-700 transition-colors duration-200"
                    >
                      Adicionar Evento
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
