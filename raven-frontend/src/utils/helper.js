export const arrayRange = (start, stop, step) =>
Array.from(
{ length: (stop - start) / step + 1 },
(value, index) => start + index * step
);


export const handleBudget = (surveyData, edit=false) => {
    const budget = {}
    for(let key in surveyData){
        if(key.includes('max') || key.includes('min')){
            let [type, field] = key.split('-')
            budget[`${type}`] = {}
            if(edit){

                budget[`${type}`][`${field}`] = parseInt(surveyData[`${type}-${field}`].split('$')[1]) || ''
            }
            else{
                if(typeof surveyData[`${type}-min`] == 'string'){
                    budget[`${type}`]['min'] = parseInt(surveyData[`${type}-min`].split('$')[1]) || ''
                }
                else{
                    budget[`${type}`]['min'] = parseInt(surveyData[`${type}-min`])
                }

                if(typeof surveyData[`${type}-max`] == 'string'){
                    budget[`${type}`]['max'] = parseInt(surveyData[`${type}-max`].split('$')[1]) || ''
                }
                else{
                    budget[`${type}`]['max'] = parseInt(surveyData[`${type}-max`])
                }
            }
        }
    }
    // console.log(budget)
    return budget
}

export const capitalize = (word) => {
    if(typeof word !== 'string' || word.length==0) return ''
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }
  