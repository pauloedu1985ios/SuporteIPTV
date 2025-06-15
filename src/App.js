import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Lightbulb, Phone, Menu, X, Film, Tv, Bug, ArrowLeft, CheckCircle, AlertCircle, Send, Star } from 'lucide-react';

// Configurações do Trello (JÁ ESTÃO EM VARIÁVEIS DE AMBIENTE EM PRODUÇÃO)
                const TRELLO_CONFIG = {
                  // Acesse as variáveis de ambiente usando process.env
                  API_KEY: process.env.REACT_APP_TRELLO_API_KEY,
                  TOKEN: process.env.REACT_APP_TRELLO_TOKEN,
                  BOARD_ID: '90pWzFcP',
                  LISTS: {
                    SOLICITACOES: '684e203b3eb82ea24df04678',
                    PROBLEMAS: '684e203b3eb82ea24df04679',
                    SUGESTOES: '684e203b3eb82ea24df0467a'
                  }
                };

const WHATSAPP_CONFIG = {
  NUMBER: '5541999999999',
  MESSAGE: encodeURIComponent('Olá! Preciso de suporte técnico para meu IPTV.')
};

// Componente de Notificação Toast
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Oculta o toast após 5 segundos
      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado ou isVisible mudar
    }
  }, [isVisible, onClose]); // Dependências do efeito

  if (!isVisible) return null; // Não renderiza se não estiver visível

  // Define as classes de cor e ícone baseadas no tipo do toast
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    // Container do toast com posicionamento fixo, cores, sombra e animação
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md z-50 animate-slide-in`}>
      <Icon size={20} /> {/* Ícone do toast */}
      <span className="flex-1">{message}</span> {/* Mensagem do toast */}
      <button onClick={onClose} className="text-white hover:text-gray-200 ml-2">
        <X size={16} /> {/* Botão para fechar o toast */}
      </button>
    </div>
  );
};

// Hook personalizado para gerenciar notificações
const useToast = () => {
  // Estado para controlar a visibilidade, mensagem e tipo do toast
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

  // Função para exibir o toast
  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  // Função para ocultar o toast
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return { toast, showToast, hideToast };
};

// Componente de Loading Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  </div>
);

// Hook para chamadas da API do Trello
const useTrelloAPI = () => {
  const createCard = async (listId, name, description) => {
    const response = await fetch(
      `https://api.trello.com/1/cards?key=${TRELLO_CONFIG.API_KEY}&token=${TRELLO_CONFIG.TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idList: listId,
          name: name,
          desc: description,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro desconhecido ao criar cartão no Trello');
    }

    return response.json();
  };

  return { createCard };
};

// Componente do Header
const Header = ({ currentView, setCurrentView, isMenuOpen, setIsMenuOpen }) => {
  // Itens do menu de navegação
  const menuItems = [
    { id: 'home', label: 'Início', icon: Star },
    { id: 'content-request', label: 'Solicitar Conteúdo', icon: Film },
    { id: 'problem-report', label: 'Relatar Problema', icon: Bug },
    { id: 'suggestions', label: 'Sugestões', icon: Lightbulb },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Tv className="text-yellow-300" size={32} />
            <div>
              <h1 className="text-xl font-bold">Suporte IPTV</h1>
              <p className="text-sm text-purple-100">Sistema de Atendimento</p>
            </div>
          </div>

          {/* Menu Desktop - visível apenas em telas maiores (md e acima) */}
          <nav className="hidden md:flex gap-6">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === id
                    ? 'bg-white/20 text-yellow-300'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </nav>

          {/* Botão do Menu Mobile - visível apenas em telas pequenas (abaixo de md) */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile Dropdown - exibido quando isMenuOpen é true */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setCurrentView(id);
                  setIsMenuOpen(false); // Fecha o menu após a seleção
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentView === id
                    ? 'bg-white/20 text-yellow-300'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

// Componente do Formulário de Solicitação de Conteúdo
const ContentRequestForm = ({ onBack, showToast }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    contentType: '',
    title: '',
    details: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const { createCard } = useTrelloAPI(); // Hook para interagir com a API do Trello

  // Lida com a mudança nos campos do formulário
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica dos campos obrigatórios
    if (!formData.contentType || !formData.title) {
      showToast('Por favor, preencha o tipo de conteúdo e o título.', 'error');
      return;
    }

    setLoading(true); // Ativa o estado de carregamento

    // Monta a descrição do cartão Trello
    const description = `
      **Tipo:** ${formData.contentType}
      **Título:** ${formData.title}
      **Prioridade:** ${formData.priority}
      **Detalhes:** ${formData.details || 'Nenhum detalhe adicional fornecido.'}
      **Data da Solicitação:** ${new Date().toLocaleString('pt-BR')}
    `.trim();

    // Monta o nome do cartão Trello
    const cardName = `[${formData.contentType}] ${formData.title}`;

    try {
      // Chama a API do Trello para criar o cartão
      await createCard(TRELLO_CONFIG.LISTS.SOLICITACOES, cardName, description);
      showToast('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
      // Limpa o formulário após o sucesso
      setFormData({ contentType: '', title: '', details: '', priority: 'normal' });
    } catch (error) {
      showToast(`Erro ao enviar solicitação: ${error.message}`, 'error');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Solicitar Conteúdo</h2>
            <p className="text-gray-600">Envie sua solicitação de filmes, séries ou canais</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Conteúdo *
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="Filme">🎬 Filme</option>
                <option value="Série">📺 Série</option>
                <option value="Canal">📡 Canal Ao Vivo</option>
                <option value="Documentário">📖 Documentário</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="baixa">🟢 Baixa</option>
                <option value="normal">🟡 Normal</option>
                <option value="alta">🟠 Alta</option>
                <option value="urgente">🔴 Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Conteúdo *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Vingadores Ultimato, Breaking Bad, CNN Brasil..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalhes Adicionais
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="4"
              placeholder="Ex: Preciso da 5ª temporada completa, episódios em HD, dublado em português..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            {loading ? <LoadingSpinner /> : <><Send size={20} /> Enviar Solicitação</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente do Formulário de Relatar Problema
const ReportProblemForm = ({ onBack, showToast }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    problemType: '',
    title: '',
    description: '',
    contact: '',
    urgency: 'normal'
  });
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const { createCard } = useTrelloAPI(); // Hook para interagir com a API do Trello

  // Lida com a mudança nos campos do formulário
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica dos campos obrigatórios
    if (!formData.problemType || !formData.description || !formData.contact) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setLoading(true); // Ativa o estado de carregamento

    // Monta a descrição do cartão Trello
    const description = `
      **Tipo de Problema:** ${formData.problemType}
      **Título:** ${formData.title || 'Não informado'}
      **Descrição:** ${formData.description}
      **Urgência:** ${formData.urgency}
      **Contato:** ${formData.contact}
      **Data do Relato:** ${new Date().toLocaleString('pt-BR')}
    `.trim();

    // Monta o nome do cartão Trello
    const cardName = `[PROBLEMA] ${formData.problemType} - ${formData.contact.substring(0, 20)}`;

    try {
      // Chama a API do Trello para criar o cartão
      await createCard(TRELLO_CONFIG.LISTS.PROBLEMAS, cardName, description);
      showToast('Problema relatado com sucesso! Nossa equipe entrará em contato.', 'success');
      // Limpa o formulário após o sucesso
      setFormData({ problemType: '', title: '', description: '', contact: '', urgency: 'normal' });
    } catch (error) {
      showToast(`Erro ao relatar problema: ${error.message}`, 'error');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Relatar Problema</h2>
            <p className="text-gray-600">Descreva o problema que está enfrentando</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onde está o problema? *
              </label>
              <select
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">Selecione uma opção</option>
                <option value="Canais Ao Vivo">📡 Canais Ao Vivo</option>
                <option value="Filmes">🎬 Filmes (VOD)</option>
                <option value="Séries">📺 Séries</option>
                <option value="Aplicativo">📱 Aplicativo</option>
                <option value="Conexão">🌐 Conexão/Internet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgência
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="baixa">🟢 Baixa - Pode aguardar</option>
                <option value="normal">🟡 Normal</option>
                <option value="alta">🟠 Alta - Preciso de ajuda</option>
                <option value="critica">🔴 Crítica - Serviço parado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Problema
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Canal SBT não funciona, Filme trava no meio..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descreva o Problema *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Descreva detalhadamente o que está acontecendo, quando começou, em quais dispositivos..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu WhatsApp para Contato *
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            {loading ? <LoadingSpinner /> : <><Bug size={20} /> Relatar Problema</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente do Formulário de Sugestões
const SuggestionsForm = ({ onBack, showToast }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    category: '',
    suggestion: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const { createCard } = useTrelloAPI(); // Hook para interagir com a API do Trello

  // Lida com a mudança nos campos do formulário
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica dos campos obrigatórios
    if (!formData.suggestion) {
      showToast('Por favor, digite sua sugestão.', 'error');
      return;
    }

    setLoading(true); // Ativa o estado de carregamento

    // Monta a descrição do cartão Trello
    const description = `
      **Categoria:** ${formData.category || 'Geral'}
      **Sugestão:** ${formData.suggestion}
      **Contato:** ${formData.contact || 'Não fornecido'}
      **Data da Sugestão:** ${new Date().toLocaleString('pt-BR')}
    `.trim();

    // Monta o nome do cartão Trello
    const cardName = `[SUGESTÃO] ${formData.suggestion.substring(0, 50)}${formData.suggestion.length > 50 ? '...' : ''}`;

    try {
      // Chama a API do Trello para criar o cartão
      await createCard(TRELLO_CONFIG.LISTS.SUGESTOES, cardName, description);
      showToast('Sugestão enviada com sucesso! Agradecemos seu feedback.', 'success');
      // Limpa o formulário após o sucesso
      setFormData({ category: '', suggestion: '', contact: '' });
    } catch (error) {
      showToast(`Erro ao enviar sugestão: ${error.message}`, 'error');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Sugestões de Melhorias</h2>
            <p className="text-gray-600">Ajude-nos a melhorar nosso serviço</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria da Sugestão
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Conteúdo">📺 Conteúdo</option>
              <option value="Interface">🎨 Interface do App</option>
              <option value="Performance">⚡ Performance</option>
              <option value="Atendimento">🤝 Atendimento</option>
              <option value="Recursos">✨ Novos Recursos</option>
              <option value="Outros">💡 Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sua Sugestão *
            </label>
            <textarea
              name="suggestion"
              value={formData.suggestion}
              onChange={handleChange}
              rows="5"
              placeholder="Descreva sua sugestão detalhadamente. Como podemos melhorar nosso serviço?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seu WhatsApp (Opcional)
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            {loading ? <LoadingSpinner /> : <><Lightbulb size={20} /> Enviar Sugestão</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente da Página Inicial
const HomePage = ({ setCurrentView }) => {
  const handleWhatsappClick = () => {
    window.open(`https://wa.me/${WHATSAPP_CONFIG.NUMBER}?text=${WHATSAPP_CONFIG.MESSAGE}`, '_blank');
  };

  const features = [
    {
      id: 'content-request',
      title: 'Solicitar Conteúdo',
      description: 'Peça filmes, séries ou canais que gostaria de ver disponíveis',
      icon: Film,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'problem-report',
      title: 'Relatar Problema',
      description: 'Informe problemas técnicos ou dificuldades que está enfrentando',
      icon: Bug,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      id: 'suggestions',
      title: 'Enviar Sugestão',
      description: 'Compartilhe ideias para melhorar nosso serviço',
      icon: Lightbulb,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white rounded-2xl p-8 shadow-xl">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Central de Suporte IPTV
          </h1>
          <p className="text-lg text-purple-100 mb-6">
            Estamos aqui para ajudar! Escolha uma das opções abaixo ou entre em contato diretamente conosco.
          </p>
          <button
            onClick={handleWhatsappClick}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <Phone size={20} />
            Falar no WhatsApp
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className={`${feature.bgColor} rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              onClick={() => setCurrentView(feature.id)}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className={`text-xl font-semibold ${feature.textColor} mb-2`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Info Section - Continuado a partir do seu código */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Como funciona?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">📝 Envie sua solicitação</h3>
            <p className="text-gray-600 text-sm">
              Preencha um dos formulários com suas informações e aguarde nosso retorno.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">⏰ Tempo de resposta</h3>
            <p className="text-gray-600 text-sm">
              Respondemos em até 24 horas úteis, problemas urgentes têm prioridade.
            </p>
          </div>
          {/* Adições para completar a seção de informações */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">🚀 Suporte Ágil</h3>
            <p className="text-gray-600 text-sm">
              Nossa equipe está pronta para resolver seus problemas com agilidade e eficiência.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">📞 Canais de Contato</h3>
            <p className="text-gray-600 text-sm">
              Além dos formulários, você pode nos contatar diretamente via WhatsApp para um atendimento rápido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


// Componente principal da aplicação React
const App = () => {
  // Estado para controlar a visualização atual da SPA
  const [currentView, setCurrentView] = useState('home');
  // Estado para controlar a abertura/fechamento do menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Hook para gerenciar as notificações toast
  const { toast, showToast, hideToast } = useToast();

  // Função para renderizar o componente de formulário correto com base na visualização atual
  const renderForm = () => {
    switch (currentView) {
      case 'content-request':
        return <ContentRequestForm onBack={() => setCurrentView('home')} showToast={showToast} />;
      case 'problem-report':
        return <ReportProblemForm onBack={() => setCurrentView('home')} showToast={showToast} />;
      case 'suggestions':
        return <SuggestionsForm onBack={() => setCurrentView('home')} showToast={showToast} />;
      case 'home':
      default:
        return <HomePage setCurrentView={setCurrentView} />;
    }
  };

  return (
    // Aplica estilos globais com Tailwind
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-12">
      {/* Script para carregar o Tailwind CSS JIT compiler */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Estilos CSS personalizados para a animação do toast */}
      <style>
        {`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slide-in 0.5s ease-out forwards;
          }

          /* Estilos para o font Inter, ideal para a aplicação */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      {/* Renderiza o cabeçalho da aplicação */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Conteúdo principal da aplicação com padding responsivo */}
      <main className="container mx-auto mt-8 px-4 md:px-0">
        {renderForm()} {/* Renderiza o formulário ou a página inicial */}
      </main>

      {/* Renderiza o componente de notificação Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

// Exporta o componente App como padrão
export default App;