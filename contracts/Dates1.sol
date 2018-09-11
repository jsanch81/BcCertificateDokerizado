/**
 * Library Dates1
 *
 * Funcion que verifica que la fecha sea verdadera
 *
 * @author Jose Sanchez, Santiago Mendoza, Mayerli Lopez & Efrain Gonzalez
 * @version 1.0
 */
pragma solidity ^0.4.0;

import "./Strings.sol";

library Dates1{

  using Strings for string;

/**
 * Funcion date, recibe tres uint cada uno representa dia, mes y a?o, verifica que sea verdadero y lo devuelve en un 
 * formato especial
 * @param day, uint que representa el dia
 * @param month, uint que representa el mes
 * @param year, uint que representa el a?o 
 * @return string, la fecha en un formato especial
 */
  function date(uint day, uint month, uint year) internal pure returns(string){
    bool biciesto = false;
    if((year % 400) == 0){
      biciesto = true;
    }else if((year % 4) == 0 && (year % 100) != 0){
      biciesto = true;
    }
    assert(month > 0);
    assert(month <= 12);
    assert(day > 0);
    if(month == 4 ||
               month == 6 ||
       month == 11){
      assert(day <= 30);
    }else if(month == 2){
      if(biciesto){
	assert(day <= 29);
      }else{
	assert(day <= 28);
      }
    }else{
      assert(day <= 31);
    }

    string memory sday = Strings.uint2str(day);
    string memory smonth = Strings.uint2str(month);
    string memory syear = Strings.uint2str(year);

    string memory _date = ((sday.concat("/")).concat((smonth.concat("/")))).concat(syear);

    return string(_date);
  }

}
