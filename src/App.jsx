import { enablePatches } from "immer";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../src/api/api";
import "./App.css";

function App() {
  const [basicSalary, setBasicSalary] = useState(0);
  const [otpayment, setotPayment] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [totalAmount, setTotal] = useState(0);
  const [list, setList] = useState("");
  const arr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    totalPay();
  }, [basicSalary, otpayment, bonusAmount]);

  const fetchData = async () => {
    await axios
      .get("/attendance")
      .then((response) => {
        return response.data.map((emp) => ({
          name: `${emp.name}`,
          gender: `${emp.gender}`,
          designation: `${emp.designation}`,
          basic_salary: `${emp.basic_salary}`,
          per_day_salary: `${emp.per_day_salary}`,
          date: new Date(`${emp.date}`),
          total_hours: `${emp.total_hours}`,
          weekday: `${emp.weekday}`,
          gender: `${emp.gender}`,
          todaysPay:0,
          otpay:0
        }));
      })
      .then((emp) => {
        if (emp) {
          setList(emp);
        }
      })
      .catch((err) => console.log(`Api Error ${err}`));
  };

  const filterlist = (e) => {
    const value = e.target.value;
    basicPay(value);
    overTime(value);
    bonusPay(value);
  };

  //Total expenses for salary
  const totalPay = () => {
    const totalToPay = basicSalary + otpayment + bonusAmount;
    setTotal(totalToPay);
  };

  const basicPay = (value) => {
    let filteredsal = list.filter((emp) => {
      const regex = new RegExp(`${value}`, "ig");
      const month = arr[emp.date.getMonth()];
      if (month.match(regex) && emp.weekday > 1 && emp.weekday < 7) {
        if (emp.total_hours >= 8) {
          emp.otPay = 0;
          emp.todaysPay = +emp.per_day_salary;
          return emp;
        }
        if (emp.total_hours < 8 && emp.total_hours >= 4) {
          emp.otPay = 0;
          emp.todaysPay = +emp.per_day_salary / 2;
          return emp;
        }
        if (emp.total_hours < 4) {
          emp.otPay = 0;
          emp.todaysPay = Number(0);
          return emp;
        }
      }
    });
    let reducedbasic = filteredsal.reduce((acc, newItem) => {
      return +acc + +newItem.todaysPay;
    }, 0);
    setBasicSalary(reducedbasic);
  };
  //Overtime calculation
  const overTime = (value) => {
   
    let overtimeFilter = list.filter((emp) => {
      const month = arr[emp.date.getMonth()];
      if (
        month.match(value) &&
        emp.weekday > 1 &&
        emp.weekday < 7 &&
        emp.total_hours > 8 &&
        emp.designation === "Worker"
      ) {
        const ot = emp.total_hours - 8.0;
        const hourlypay = (emp.per_day_salary / 8) * 2;
        emp.otpay = ot * hourlypay;
        return emp;
      }
      if (month.match(value) && emp.designation === "Worker") {
        if (emp.weekday == 1 || emp.weekday == 7) {
          emp.otpay = emp.per_day_salary * 2;
          return emp;
        }
      }
    });
    let otPay = overtimeFilter.reduce((acc, newItem) => {
      return +acc + +newItem.otpay;
    }, 0);
    setotPayment(otPay);
  };
  //Reuseable function for bonusPay
  const reducerTodayspay = (arr) => {
    return arr.reduce((acc, newItem) => {
      const reducedValueBasic = +acc + +newItem.todaysPay;
      return +reducedValueBasic;
    }, 0);
  };
  const reducerOt = (arr) => {
    return arr.reduce((acc, newItem) => {
      const reducedOt = +acc + +newItem.otpay;
      return +reducedOt;
    }, 0);
  };
  //Bonus Calculation
  const bonusPay = (value) => {
    const regex = new RegExp(`${value}`, "ig");
    const maleBonuses = list.filter((emp) => {
      const month = arr[emp.date.getMonth()];
      if (
        emp.gender === "Male" &&
        month.match(regex) &&
        emp.otpay !== undefined &&
        emp.todaysPay !== undefined 
      ) {
        return emp;
      }
    });
    const femalebonuses = list.filter((emp) => {
      const month = arr[emp.date.getMonth()];
      if (
        emp.gender === "Female" &&
        month.match(regex) &&
        emp.otpay !== undefined &&
        emp.todaysPay !== undefined
      ) {
        return emp;
      }
    });
    const overallBaseSalaryMale = reducerTodayspay(maleBonuses);
    const overallOtSalaryMale = reducerOt(maleBonuses);
    const overallBaseSalaryFemale = reducerTodayspay(femalebonuses);
    const overallOtSalaryFemale = reducerOt(femalebonuses);
    console.log(overallBaseSalaryMale, overallOtSalaryMale);
    const overallSalaryMale = +overallBaseSalaryMale + +overallOtSalaryMale;
    const overallSalaryFemale =
      +overallBaseSalaryFemale + +overallOtSalaryFemale;
    if (+overallSalaryMale < +overallSalaryFemale) {
      setBonusAmount(() => (+overallSalaryMale * 1) / 100);
    } else setBonusAmount(() => (+overallSalaryFemale * 1) / 100);
  };

  //Jsx
  return (
    <div className="App">
      <h1 className="logo">BitCot</h1>
      <div className="tableview">
        <h1>Salary Expenses</h1>
        <div className="months">
          <label>Month &nbsp; </label>

          <select id="month" onChange={filterlist}>
            {arr.map((month, i) => (
              <option className="selectDropdown" value={month} key={i}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Basic Salary</th>
              <th>Overtime</th>
              <th>Bonus</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{basicSalary} INR</td>
              <td>{otpayment} INR</td>
              <td>{bonusAmount} INR</td>
              <td>{totalAmount} INR</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
