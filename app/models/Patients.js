
const { fetch, fetchOne } = require('../Library/postgres');

const patientsSql = `
    SELECT P.*, MAX(A.appointment_time) AS last_appointment_date
FROM Patients P
LEFT JOIN Appointments A ON P.patient_id = A.patient_id
GROUP BY P.patient_id
ORDER BY last_appointment_date DESC limit $1 offset ($2 - 1) * $1;
`;

const getPatientsByAppointmentDate = `
SELECT
    p.*,
    a.*
FROM
    Patients p
JOIN
    Appointments a ON p.patient_id = a.patient_id
WHERE
    a.appointment_time >= NOW() - $1::interval
ORDER BY
    a.appointment_time DESC
limit $2 offset ($3 - 1) * $2
;`;

const searchPatientsByName = `SELECT *
FROM Patients
WHERE lower(patient_name) LIKE lower('%' || $1 || '%') limit $2 offset ($3 - 1) * $2;`;

const patientOneSql = `select * from patients where patient_id = $1;`;

const createPatientSql = `
insert into patients ( patient_name,
  patient_surname,
  patient_phone_number,
  patient_birth_date,
  patient_address ) values ($1, $2, $3, $4, $5) returning *
`;

const deletePatientSql = `
    delete from patients where patient_id = $1 returning *
`;

const patients = async ({ query }) => {
  if (query.patient_id) {
    return await fetchOne(patientOneSql, +query.patient_id);
  }
  let { p: page = null, l: limit = null } = query;
  if(query.search){
    return await fetch(searchPatientsByName,query.search, limit, page);
  }
  if(query.interval){
    return await fetch(
      getPatientsByAppointmentDate,
      query.interval.split('+').join(' '),
      limit,
      page
    );
  }
  return await fetch(patientsSql, limit, page);
};


const createPatient = async ({
  patient_name,
  patient_surname,
  patient_phone_number,
  patient_birth_date,
  patient_address,
}) => {
  return await fetchOne(
    createPatientSql,
    patient_name,
  patient_surname,
  patient_phone_number,
  patient_birth_date,
  patient_address,
  );
};

const updatePatient = async ({ patient_id, column, value }) => {
  return await fetchOne(
    `update patients set ${column} = $2 where patient_id = $1 returning *`,
    patient_id,
    value
  );
};

const deletePatient = async ({ patient_id }) => {
  return await fetchOne(deletePatientSql, patient_id);
};

module.exports.patients = patients;
module.exports.createPatient = createPatient;
module.exports.updatePatient = updatePatient;
module.exports.deletePatient = deletePatient;
