export default function calculateAge(birthdate) {
    // Create a Date object for the birthdate
    const birthDate = new Date(birthdate);

    // Create a new Date object for the current date
    const today = new Date();

    // Calculate the difference in years
    let age = today.getFullYear() - birthDate.getFullYear();

    // Get the month difference from this year
    const month = today.getMonth() - birthDate.getMonth();

    // If the current month is less than the birth month or
    // if the current month is the same as the birth month but the current day is less than the birth day,
    // then the person hasn't had their birthday yet for this year, so subtract 1 from age.
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}
 