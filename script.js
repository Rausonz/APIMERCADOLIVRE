// Salva um valor no localStorage quando o campo muda
function salvarCampo(id) {
  const input = document.getElementById(id);
  input.addEventListener('input', () => {
    localStorage.setItem(id, input.value);
  });
}

// Carrega um valor do localStorage quando a página abre
function carregarCampos() {
  const campos = [
    'clientIdInput',
    'redirectUriInput',
    'clientSecretInput',
    'tokenInput',
  ];
  campos.forEach(id => {
    const salvo = localStorage.getItem(id);
    if (salvo) document.getElementById(id).value = salvo;
  });
}

function iniciarLogin() {
  const clientId = document.getElementById('clientIdInput').value.trim();
  const redirectUri = document.getElementById('redirectUriInput').value.trim();

  if (!clientId || !redirectUri) {
    alert('Preencha Client ID e Redirect URI.');
    return;
  }

  const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.open(authUrl, '_blank');
}

const params = new URLSearchParams(window.location.search);
const codeFromUrl = params.get('code');
if (codeFromUrl) {
  document.getElementById('code').textContent = codeFromUrl;
  document.getElementById('codeInput').value = codeFromUrl;
}

function atualizarCodigo() {
  const novoCodigo = document.getElementById('codeInput').value.trim();
  if (novoCodigo) {
    document.getElementById('code').textContent = novoCodigo;
  } else {
    alert('Cole um código válido antes de atualizar.');
  }
}

function gerarToken() {
  const code = document.getElementById('codeInput').value.trim();
  const clientId = document.getElementById('clientIdInput').value.trim();
  const clientSecret = document.getElementById('clientSecretInput').value.trim();
  const redirectUri = document.getElementById('redirectUriInput').value.trim();

  if (!code || !clientId || !clientSecret || !redirectUri) {
    alert('Preencha todos os campos (Client ID, Secret, Redirect e TG Code).');
    return;
  }

  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri
  });

  fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data.toString(),
  })
  .then(res => {
    if (!res.ok) throw new Error('Erro ao gerar token: ' + res.status);
    return res.json();
  })
  .then(json => {
    document.getElementById('tokenGerado').textContent = JSON.stringify(json, null, 2);
    if (json.access_token) {
      document.getElementById('tokenInput').value = json.access_token;
      alert('Token gerado com sucesso!');
    }
  })
  .catch(err => {
    document.getElementById('tokenGerado').textContent = err;
  });
}

function buscarProduto() {
  const token = document.getElementById('tokenInput').value.trim();
  const mlb = document.getElementById('mlbInput').value.trim();

  if (!token || !mlb) {
    alert('Insira um token e código MLB.');
    return;
  }

  document.getElementById('produto').textContent = 'Carregando...';

  fetch(`https://api.mercadolibre.com/items/${mlb}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(res => {
    if (!res.ok) throw new Error('Erro: ' + res.status);
    return res.json();
  })
  .then(data => {
    document.getElementById('produto').textContent = JSON.stringify(data, null, 2);
  })
  .catch(err => {
    document.getElementById('produto').textContent = err;
  });
}

// Ativa salvamento automático
window.onload = () => {
  carregarCampos();
  salvarCampo('clientIdInput');
  salvarCampo('redirectUriInput');
  salvarCampo('clientSecretInput');
  salvarCampo('tokenInput');
  };
