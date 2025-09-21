// Configuração para deployment no XAMPP
export const deployConfig = {
  // Configurações do XAMPP
  xampp: {
    // Ajuste conforme sua instalação
    basePath: 'C:/xampp/htdocs',
    projectName: 'medical-app',
    
    // URLs de acesso
    localUrl: 'http://localhost',
    
    // Configurações do servidor
    defaultPort: 80,
  },
  
  // Configurações do build
  build: {
    outputDir: 'dist',
    publicPath: '/', // Para XAMPP, usar raiz
    
    // Otimizações para produção
    minify: true,
    sourcemap: false,
    
    // Configurações específicas para mobile
    mobile: {
      viewport: 'width=device-width,initial-scale=1',
      themeColor: '#006571',
      backgroundColor: '#ffffff',
    }
  },
  
  // Configurações do Capacitor
  capacitor: {
    webDir: 'dist',
    bundledWebRuntime: false,
    
    // Configurações para Android
    android: {
      buildDir: 'android',
      minSdkVersion: 22,
      compileSdkVersion: 34,
      targetSdkVersion: 34,
    },
    
    // Configurações para iOS
    ios: {
      buildDir: 'ios',
      scheme: 'MedicalApp',
      minVersion: '13.0',
    }
  }
};