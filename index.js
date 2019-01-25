const puppeteer = require('puppeteer');
const config = require("./config.json");

(async () => {

  //Instanciando un browser
  const browser = await puppeteer.launch({ headless: false });

  // nueva pag
  const page = await browser.newPage();

  // custom viewport
  await page.setViewport({ width: 1280, height: 800 }) 

  // Metodo para cerrar el navegador
  let logout = async() => {
    console.log("Saliendo");
    await browser.close();
  }

  //Metodo login
  let login = async (username,password) => {
    
    console.log("Entrando pagina del itla...")
    // networkidle2 para esperar que cargue todo por completo
    await page.goto("https://itla.edu.do/virtual/", {waitUntil: 'networkidle2'});


    // seeh
    console.log("LLenando credenciales...");
    await page.type("#username",username);
    await page.type("#password",password);

    // btn de clickear
    console.log("Logeando...")
    await page.click("#loginbtn");

    // Ningun wait me quiso funcionar asi que gg wp _aiuda_
    console.log("Esperando 3 segundos por bugs del itla ")
    await page.waitFor(3000);

    // screenshot despues del login
    // await page.screenshot({path: 'example.png'});
  }

  //Metodo para obtener todas los enlaces de las asignaturas
  let asignaturas = async ()=>{
    console.log("Buscando materias...")
    await page.goto("https://itla.edu.do/virtual/?redirect=0",{waitUntil:"networkidle2"});

    // esperar que carguen todos los cursos 
    await page.waitForSelector(".coursebtn");

    // solo se necesitan los href 
    console.log("Obteniendo links de materias...");
    let links = await page.$$eval(".coursebtn", lins => lins.map(a => a.href));

    return links;
  }

  // Metodo para entrar a cada asignatura
  let entrarAsig = async(links) => {


    for (let i = 0; i < links.length; i++) {
      let asig = links[i];

      await page.goto(asig, {waitUntil:'networkidle2'});

      // Obtener el nombre de la asignatura ez
      let nombreAsig = await page.$eval('#sitetitle', s => s.innerHTML)
      console.log("["+nombreAsig+"] Listo!");

      // xd
      await page.waitFor(2000);
    }

  }

  // ===========================================
  await login(config.username, config.password);
  let todasAsig = await asignaturas();
  await entrarAsig(todasAsig);
  await logout();
  // ===========================================

  //TODO 
  // - Manejo de errores 
  // - Saber cuanto tiempo min se debe de quedar en la pagina
  // - Custom headless en consola
  // - Algo ma talve qsy
})();