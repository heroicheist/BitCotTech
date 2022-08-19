const filterlist = (e) => {
    const value = e.target.value;
    // basicPay(value)
    overTime(value)
  };

  // const basicPay = (value)=>{
  //   let filteredsal = list.filter((emp) => {
  //     const regex = new RegExp(`${value}`, "ig");
  //     const month = arr[emp.date.getMonth()];
  //     if (month.match(regex) && emp.total_hours >8) {
  //       emp.todayPay = emp.per_day_salary;
  //       return emp.todayPay
  //     }
  //     else if(month.match(regex) && emp.total_hours < 8) {
  //       emp.todayPay = +emp.per_day_salary/2
  //       return emp.todaypay
  //     }
  //     else if(month.match(regex) && emp.total_hours < 4 ) {
  //       emp.todayPay = +0
  //       return emp.todayPay
  //     }
  //   });
  //   let reducedbasic = filteredsal.reduce((a, b) => {
  //     return +a + +b.basic_salary;
  //   }, 0);
  //   setBasic(reducedbasic);
  // }

  const overTime = (value) => {
    let overtimeFilter = list.filter((emp)=>{
      const month = arr[emp.date.getMonth()];
      const regex = new RegExp(/Worker/, "ig");
      if(emp.designation.match(regex) && month.match(value) && emp.total_hours> 8 ){
          const ot =  emp.total_hours-8.0
          const hourlypay = emp.per_day_salary / 8
          const total = hourlypay*2*ot
         return emp.otpay=total
       }
    }) 
    let otPay = overtimeFilter.reduce((a,b)=>{
      return +a + +b.otpay
    }, 0) 
    setot(otPay)  
  }

  //  const salaryReducer =(filarr,val)=>{
  //      return filarr.reduce((a, b)=>{
  //       return +a + +b.val 
  //      },0)
  //  }
  //Jsx



  const overallBaseSalaryMale = reducerTodayspay(maleBonuses);
  const overallOtSalaryMale = reducerOt(maleBonuses);
  const overallBaseSalaryFemale = reducerTodayspay(femalebonuses);
  const overallOtSalaryFemale = reducerOt(femalebonuses);

  const overallSalaryMale = overallBaseSalaryMale+overallOtSalaryMale;
  const overallSalaryFemale = overallBaseSalaryFemale+overallOtSalaryFemale;


  const reducerTodayspay = (arr) => {
    return arr.reduce((a, b) => {
      const red = +a + +b.todaysPay;
      return red;
    }, 0);
  };
  const reducerOt = (arr) => {
    return arr.reduce((a, b) => {
      const red = +a + +b.todaysPay;
      return red;
    }, 0);
  };