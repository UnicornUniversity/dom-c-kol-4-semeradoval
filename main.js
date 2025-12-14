/**
 * Main function
 * @param {object} dtoIn input data
 * @returns {object} dtoOut output data
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const statistics = getEmployeeStatistics(employees);

  return {
    employees,
    statistics
  };
}

/**
 * Jména a příjmení
 */
const namesData = {
  femaleFirstNames: [
    "Eliška","Viktorie","Sofie","Anna","Natálie","Amálie","Ema","Tereza","Laura",
    "Adéla","Julie","Rozálie","Nela","Mia","Emma","Karolína","Barbora","Sára",
    "Stella","Anežka","Veronika","Kristýna","Marie","Lucie","Valerie"
  ],
  maleFirstNames: [
    "Matyáš","Jakub","Vojtěch","Jan","Matěj","Filip","David","Tomáš","Daniel",
    "Dominik","Tobiáš","Oliver","Štěpán","Antonín","Sebastian","Lukáš","Martin",
    "Ondřej","Mikuláš","Adam","Jonáš","Samuel","Tadeáš","Šimon​","Eliáš"
  ],
  femaleLastNames: [
    "Nováková","Novotná","Dvořáková","Svobodová","Kučerová","Procházková","Černá",
    "Veselá","Horáková","Němcová","Marková","Benešová","Králová","Marešová",
    "Růžičková","Kadlecová","Sedláková","Pokorná","Urbanová","Doležalová",
    "Jelínková","Havlová","Zemanová","Horáčková","Kratochvílová","Málková",
    "Fialová","Pavlová","Konečná","Krejčová","Šimková","Holubová","Čechová",
    "Petrová","Bartošová","Křížová","Vlčková","Machová","Vlachová","Richterová",
    "Štěpánková","Kovářová","Tomanová","Hrušková","Součková","Nečasová",
    "Sýkorová","Matoušková","Blažková","Andrlová"
  ],
  maleLastNames: [
    "Novák","Novotný","Dvořák","Svoboda","Kučera","Procházka","Černý","Veselý",
    "Horák","Němec","Marek","Beneš","Král","Mareš","Růžička","Kadlec","Sedlák",
    "Pokorný","Urban","Doležal","Jelínek","Havel","Zeman","Horáček","Kratochvíl",
    "Málek","Fiala","Pavel","Konečný","Krejčí","Šimek","Holub","Čech","Petr",
    "Bartoš","Kříž","Vlček","Mach","Vlach","Richter","Štěpánek","Kovář","Toman",
    "Hruška","Souček","Nečas","Sýkora","Matoušek","Blažek","Andrle"
  ]
};

/**
 * Generace
 */

/**
 * náhodné generování zaměstnanců
 * @param Object[] dtoIn 
 * @returns Object
 */
export function generateEmployeeData(dtoIn) {
  const count = dtoIn.count;
  const minAge = dtoIn.age.min;
  const maxAge = dtoIn.age.max;

  const now = new Date();
  const employees = [];

  for (let i = 0; i < count; i++) {
    const gender = Math.random() < 0.5 ? "male" : "female";

    let firstName, lastName;
    if (gender === "male") {
      firstName = namesData.maleFirstNames[getRandomNumber(namesData.maleFirstNames.length)];
      lastName = namesData.maleLastNames[getRandomNumber(namesData.maleLastNames.length)];
    } else {
      firstName = namesData.femaleFirstNames[getRandomNumber(namesData.femaleFirstNames.length)];
      lastName = namesData.femaleLastNames[getRandomNumber(namesData.femaleLastNames.length)];
    }

    const youngestBirthDate = new Date(
      now.getFullYear() - minAge,
      now.getMonth(),
      now.getDate()
    );

    const oldestBirthDate = new Date(
      now.getFullYear() - maxAge,
      now.getMonth(),
      now.getDate()
    );

    const randomTime =
      oldestBirthDate.getTime() +
      Math.random() * (youngestBirthDate.getTime() - oldestBirthDate.getTime());

    const workloadOptions = [10, 20, 30, 40];

    employees.push({
      gender,
      firstName,
      lastName,
      dateOfBirth: new Date(randomTime).toISOString(),
      workload: workloadOptions[getRandomNumber(workloadOptions.length)]
    });
  }

  return employees;
}

/**
 * Statistiky
 */
/**
 * vytváření statistik o zaměstnancích
 * @param Object[] employees 
 * @returns Object
 */
export function getEmployeeStatistics(employees) {
  const ages = employees.map(e => calculateAge(new Date(e.dateOfBirth)));
  const workloads = employees.map(e => e.workload);

  const femaleEmployees = employees.filter(e => e.gender === "female");

  return {
    total: employees.length,
    workload10: countByWorkload(workloads, 10),
    workload20: countByWorkload(workloads, 20),
    workload30: countByWorkload(workloads, 30),
    workload40: countByWorkload(workloads, 40),
    averageAge: employees.length
      ? roundToOneDecimal(ages.reduce((sum, age) => sum + age, 0) / ages.length)
      : 0,
    minAge: Math.min(...ages),
    maxAge: Math.max(...ages),
    medianAge: calculateMedian(ages),
    medianWorkload: calculateMedian(workloads),
    averageFemaleWorkload: femaleEmployees.length
      ? roundToOneDecimal(
          femaleEmployees.reduce((sum, e) => sum + e.workload, 0) / femaleEmployees.length
        )
      : 0,
    employeesSortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload)
  };
}

/* -------------------- Helper functions -------------------- */
/**
 * vypočítává rozsah věku dle zadání
 * @param string birthDate
 * @returns number
 */
function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
/**
 * vypočítává průměr věku dle zadání
 * @param number[] values averageAge
 * @returns number
 */
function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

// Filtr workloads

/**
 * spočítá absolutní počet úvazků dle hodin za týden
 * @param number[] workloads 
 * @param number type 
 * @returns number
 */
function countByWorkload(workloads,type) {
  return workloads.filter(w => w==type).length;
}

/**
 * vypočítává číslo s jedním desetinným číslem
 * @param number value 
 * @returns number
 */
function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

/**
 * generuje náhodné číslo
 * @param number max 
 * @returns number
 */
function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

//testy
/*
const dtoIn = {
  count: 10,
  age: {
    min: 19,
    max: 35
  }
}
console.log(JSON.stringify(main(dtoIn), null, 4))
//console.log(main(dtoIn))
*/
