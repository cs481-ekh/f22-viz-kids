
export const labeledSegments: [string,string][] = [

    /* Head */
    ["LFHD","RFHD"], //forehead
    ["LBHD","RBHD"], //back of head
    ["LFHD","LBHD"], //side of head
    ["RFHD","RBHD"], //side of head

    /* Center Torso */
    ["LACR","RACR"], //collar bone
    ["MID_HJC","MID_ASIS"], //groin front
    ["MID_HJC","MID_PSIS"], //groin back

    /* L Torso */
    ["LILCR","LACR"], //upper side
    ["LILCR","LGTR"], //lower side
    ["LASIS","LGTR"], //outer front waist
    ["LPSIS","LGTR"], //outer back waist
    ["LASIS","MID_ASIS"], //inner front waist
    ["LPSIS","MID_PSIS"], //inner back waist

    /* R Torso */
    ["RILCR","RACR"], //upper side
    ["RILCR","RGTR"], //lower side
    ["RASIS","RGTR"], //outer front waist
    ["RPSIS","RGTR"], //outer back waist
    ["RASIS","MID_ASIS"], //inner front waist
    ["RPSIS","MID_PSIS"], //inner back waist

    /* L Arm */
    ["LSHO","LLEB"], //outer arm
    ["LSHO","LMEB"], //inner arm
    ["LLEB","LMEB"], //elbow crease
    ["LLEB","LLWRT"], //outer forearm
    ["LMEB","LMWRT"], //inner forearm
    ["LLWRT","LMWRT"], //wrist crease
    ["LHAND","LLWRT"], //thumb side of hand
    ["LHAND","LMWRT"], //pinkie side of hand

    /* R Arm */
    ["RSHO","RLEB"], //outer arm
    ["RSHO","RMEB"], //inner arm
    ["RLEB","RMEB"], //elbow crease
    ["RLEB","RLWRT"], //outer forearm
    ["RMEB","RMWRT"], //inner forearm
    ["RLWRT","RMWRT"], //wrist crease
    ["RHAND","RLWRT"], //thumb side of hand
    ["RHAND","RMWRT"], //pinkie side of hand

    /* L Upper Leg */
    ["LGTR","LLEP"], //outer leg
    ["MID_HJC","LMEP"], //inner leg
    ["LTHI","LLEP"], //outer top of kneecap
    ["LTHI","LMEP"], //inner top of kneecap
    ["LPSK","LLEP"], //outer bottom of kneecap
    ["LPSK","LMEP"], //inner bottom of kneecap
    ["LASIS","LTHI"], //front of thigh

    /* L Lower Leg */
    ["LLEP","LLMAL"], //outer calf
    ["LMEP","LMMAL"], //inner calf
    ["LDSK","LLMAL"], //outer front of ankle
    ["LDSK","LMMAL"], //inner front of ankle
    ["LDSK","LPSK"], //front of shin

    /* L Foot */
    ["LHEEL","LTOE"], //inner edge of foot
    ["LHEEL","LMET5"], //outer edge of foot
    ["LHEEL","LLMAL"], //outer top of heel
    ["LHEEL","LMMAL"], //inner top of heel
    ["LTOE","LMET5"], //toes

    /* R Upper Leg */
    ["RGTR","RLEP"], //outer leg
    ["MID_HJC","RMEP"], //inner leg
    ["RTHI","RLEP"], //outer top of kneecap
    ["RTHI","RMEP"], //inner top of kneecap
    ["RPSK","RLEP"], //outer bottom of kneecap
    ["RPSK","RMEP"], //inner bottom of kneecap
    ["RASIS","RTHI"], //front of thigh

    /* R Lower Leg */
    ["RLEP","RLMAL"], //outer calf
    ["RMEP","RMMAL"], //inner calf
    ["RDSK","RLMAL"], //outer front of ankle
    ["RDSK","RMMAL"], //inner front of ankle
    ["RDSK","RPSK"], //front of shin

    /* R Foot */
    ["RHEEL","RTOE"], //inner edge of foot
    ["RHEEL","RMET5"], //outer edge of foot
    ["RHEEL","RLMAL"], //outer top of heel
    ["RHEEL","RMMAL"], //inner top of heel
    ["RTOE","RMET5"], //toes

];