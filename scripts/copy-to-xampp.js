import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações - ajuste conforme sua instalação do XAMPP
const config = {
  projectName: 'medical-app', // Nome da pasta no htdocs
  xamppPath: 'C:/xampp/htdocs', // Caminho padrão do XAMPP no Windows
  distPath: path.join(__dirname, '..', 'dist'),
};

async function copyToXampp() {
  try {
    const targetPath = path.join(config.xamppPath, config.projectName);
    
    console.log('🚀 Iniciando cópia para XAMPP...');
    console.log(`📁 Origem: ${config.distPath}`);
    console.log(`📁 Destino: ${targetPath}`);
    
    // Verificar se a pasta dist existe
    if (!await fs.pathExists(config.distPath)) {
      throw new Error('Pasta dist não encontrada. Execute "npm run build" primeiro.');
    }
    
    // Verificar se o XAMPP existe
    if (!await fs.pathExists(config.xamppPath)) {
      throw new Error(`Pasta do XAMPP não encontrada em: ${config.xamppPath}`);
    }
    
    // Remover pasta de destino se existir
    if (await fs.pathExists(targetPath)) {
      console.log('🗑️  Removendo pasta existente...');
      await fs.remove(targetPath);
    }
    
    // Copiar arquivos
    console.log('📋 Copiando arquivos...');
    await fs.copy(config.distPath, targetPath);
    
    console.log('✅ Cópia concluída com sucesso!');
    console.log(`🌐 Acesse: http://localhost/${config.projectName}`);
    
  } catch (error) {
    console.error('❌ Erro na cópia:', error.message);
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  copyToXampp();
}

export { copyToXampp };