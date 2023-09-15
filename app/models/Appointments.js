const { fetch, fetchOne } = require('../Library/postgres');

const appointmentsSql = `
    select * from appointments limit $1 offset ($2 - 1) * $1;
`;

const getVisitedAppointmentsByPatient = `SELECT *
FROM Appointments
WHERE patient_id = $1 AND appointment_is_visited = TRUE limit $2 offset ($3 - 1) * $2;`;


const getAllAppointmentsByPatient = `SELECT *
FROM Appointments
WHERE patient_id = $1
ORDER BY appointment_time DESC limit $2 offset ($3 - 1) * $2;`;

const getAppointmentsPriceByPatient = `SELECT
    patient_id,
    SUM(appointment_price) AS overall_price,
    SUM(appointment_paid) AS paid_price,
    SUM(appointment_price) - SUM(appointment_paid) AS unpaid_price
FROM Appointments
WHERE patient_id = $1
GROUP BY patient_id;`;

const createAppointmentSql = `
insert into appointments ( patient_id, appointment_time, appointment_diagnose, appointment_cure_type, appointment_price, appointment_paid, appointment_is_visited ) values ($1, $2, $3, $4, $5, $6, $7) returning *
`;

const deleteAppointmentSql = `
    delete from appointments where appointment_id = $1 returning *
`;

const appointments = async ({ query }) => {
  if(query.getAppointmentsPriceByPatient){
    return await fetchOne(
      getAppointmentsPriceByPatient,
      +query.getAppointmentsPriceByPatient
    );
  }
  let { p: page = null, l: limit = null } = query;
  if (query.getVisitedAppointmentsByPatient){
    return await fetch(
      getVisitedAppointmentsByPatient,
      +query.getVisitedAppointmentsByPatient, limit,
      page
    );
  }
  if (query.getAllAppointmentsByPatient){
    return await fetch(
      getAllAppointmentsByPatient,
      +query.getAllAppointmentsByPatient,
      limit,
      page
    );
  }
    return await fetch(appointmentsSql, limit, page);
};

const createAppointment = async ({
  patient_id,
  appointment_time,
  appointment_diagnose,
  appointment_cure_type,
  appointment_price,
  appointment_paid,
  appointment_is_visited,
}) => {
  return await fetchOne(
    createAppointmentSql,
    patient_id,
    appointment_time,
    appointment_diagnose,
    appointment_cure_type,
    appointment_price,
    appointment_paid,
    appointment_is_visited
  );
};

const updateAppointment = async ({ appointment_id, column, value }) => {
  return await fetchOne(
    `update appointments set ${column} = $2 where appointment_id = $1 returning *`,
    appointment_id,
    value
  );
};

const deleteAppointment = async ({ appointment_id }) => {
  return await fetchOne(deleteAppointmentSql, appointment_id);
};

module.exports.appointments = appointments;
module.exports.createAppointment = createAppointment;
module.exports.updateAppointment = updateAppointment;
module.exports.deleteAppointment = deleteAppointment;
