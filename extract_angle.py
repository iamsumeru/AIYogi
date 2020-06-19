# -*- coding: utf-8 -*-
"""
Created on Fri Jun 12 21:08:03 2020

@author: Sumeru Nayak
"""
print('\n')
print("############################################")
print("################AIYOGI######################")
print("############################################")
print('\n')
import os
import pandas as pd
import numpy as np
import math
import random
import glob


#################################################
#utility subroutines#############################
#################################################
def dot(x,y):
    return sum(x_i*y_i for x_i, y_i in zip(x,y))

def calc_average_x(df,idx1s,idx2s):
    idx1 = int(idx1s)
    idx2 = int(idx2s)
    x_avg = float(df.loc[idx2,0])+float(df.loc[idx1,0])
    return x_avg/(2.0)

def calc_average_y(df,idy1s,idy2s):
    idy1 = int(idy1s)
    idy2 = int(idy2s)
    y_avg = float(df.loc[idy2,1])+float(df.loc[idy1,1])
    return y_avg/(2.0)


#################################################
##cos theta = u dot v/ mod(u) mod(v)#############
#################################################    
# def calc_angle(df,idx1s, idx2s, idx3s):
#     idx1 = int(idx1s)
#     idx2 = int(idx2s)
#     idx3 = int(idx3s)
#     u_x = float(df.loc[idx2,'x'])-float(df.loc[idx1,'x'])
#     u_y = float(df.loc[idx2,'y'])-float(df.loc[idx1,'y'])
#     u_vec = np.array([u_x,u_y])
#     v_x = float(df.loc[idx3,'x'])-float(df.loc[idx2,'x'])
#     v_y = float(df.loc[idx3,'y'])-float(df.loc[idx2,'y'])
#     v_vec = np.array([v_x,v_y])
#     norm_product = (np.linalg.norm(u_vec))*(np.linalg.norm(v_vec))
#     cos_theta = dot(u_vec,v_vec)/norm_product
#     theta = math.degrees (math.acos(cos_theta))
#     return theta

def calc_angle(df,idx1s, idx2s, idx3s):
    idx1 = int(idx1s)
    idx2 = int(idx2s)
    idx3 = int(idx3s)
    x1 = float(df.loc[idx1,'x'])
    x2 = float(df.loc[idx2,'x'])
    x3 = float(df.loc[idx3,'x'])
    y1 = float(df.loc[idx1,'y'])
    y2 = float(df.loc[idx2,'y'])
    y3 = float(df.loc[idx3,'y'])
    x1_x2 = x1-x2
    y1_y2 = y1-y2
    x1_x3 = x1-x3
    y1_y3 = y1-y3
    x2_x3 = x2-x3
    y2_y3 = y2-y3
    a_s = x1_x2*x1_x2 + y1_y2*y1_y2
    b_s = x2_x3*x2_x3 + y2_y3*y2_y3
    c_s = x1_x3*x1_x3 + y1_y3*y1_y3
    a = math.sqrt(a_s)
    b = math.sqrt(b_s)
    cos_theta = (a_s+b_s-c_s)/(2.0*a*b)
    theta = math.degrees (math.acos(cos_theta))
    return theta

def main():
    ##################################################
    ##modify output from image_demo.py################
    ##insert blank line at top########################
    ##optional step###################################
    ##################################################
    # f = open('./output/keypoints.txt',"a")
    # f.seek(0)
    # f.write('\n')
    # f.close()
    
    ##################################################
    #Load data########################################
    ##################################################
    df = pd.read_csv('./output/test_jpeg/keypoints.txt', delimiter ="\[ |\t\[|\t\[ |\[|\]|\ ]", engine='python',names = ['biomarkers','XY','dummy'])
    df_mod = pd.DataFrame(df.XY.str.strip().tolist())
    df_mod.columns =['XY_mod_1']
    XYdata= pd.DataFrame(df_mod.XY_mod_1.str.split(' ',1).tolist())
    XYdata.columns = ['x','y']
    
    
    
    ################################################
    ##choosing random indices for testing###########
    ##optional step#################################
    ##uncomment for fun in console##################    
    ################################################    
    # sz = int(df.size)
    # no_pic = math.ceil(sz/(33*3))
    # n = random.randint(0,no_pic)
    # range_low = (16*n)+1
    # range_hi = range_low + 16
    # index = random.randint(range_low,range_hi) 
    # index1 = index
    # index2 = index + 2
    # index3 = index + 4    
    # #print ("Marker 1 ="+df.loc[index1])
    # print("Angle between")
    # print('\n')
    # print(df.loc[index1] + " and ")
    # print ('\n')
    # print (df.loc[index2] + "and")
    # print ('\n')
    # print (df.loc[index3])
    # print ('\n')
    # print ("for image"+str(n+1))
    # print ('\n is')
    # print (str(calc_angle(XYdata,str(index1),str(index2),str(index3))))
    
    
    ################################################
    ##detecting recognized poses####################
    ################################################
    print(".....Sieving out undetected poses.......")
    pose_list = []
    index_path = 0
    remove_index = []
    line_index_temp = 0
    path = glob.glob('C:/Users/User/Downloads/posenet-python-master/custom_images/test_jpeg/*.jpg') 
    
    for file in path:
        pose_list.append(os.path.basename(path[index_path]))
        index_path += 1
    
    with open('./output/test_jpeg/keypoints_pose.txt') as f: data = f.readlines()
    line_no = [x for x in range(len(data)) if 'file number\n' in data[x].lower()]
    
    for line_index_temp in range((len(line_no)-1)):
        if (line_no[line_index_temp+1] - line_no[line_index_temp]) == 3:
            remove_index.append(line_index_temp)
        line_index_temp +=1
    fo_out = open('./output/test_jpeg/outputangles_triangle.txt',"w") 
    fo_out.writelines('\n')
    fo_out.writelines("#################################################################################")
    fo_out.writelines('\n')
    fo_out.writelines("###########################Trained at AIYogi#####################################") 
    fo_out.writelines('\n') 
    fo_out.writelines("#################################################################################")
    fo_out.writelines('\n')
    fo_out.writelines('\n')
    for rem_index in sorted(remove_index, reverse=True):
        print (pose_list[rem_index]+ " needs to be recaptured\n")
        fo_out.writelines("Picture in sequence "+str(rem_index+1)+ " named ")
        fo_out.writelines(pose_list[rem_index]+ " needs to be recaptured")
        fo_out.writelines('\n')
        del pose_list[rem_index]
    print("List of identified poses are \n")
    print(pose_list)
    fo_out.writelines('\n')
    fo_out.writelines("List of identified poses are ")
    fo_out.writelines('\n')
    sq = 0
    for pose in pose_list:
        fo_out.writelines("POSE ")
        fo_out.writelines(str(sq+1))
        fo_out.writelines(". ")
        fo_out.writelines(pose.replace(".jpg",""))
        fo_out.writelines('\n')
        sq += 1
    fo_out.writelines('\n')
    
            
    ###############################################
    ##writing output data##########################
    ###############################################
    print ("\n.....Writing output angles for detected poses......\n")
    
    sequence = 0
    sequence_t = 0
    angle_marker = ['elbow','shoulder','hip','knee']
    
    ##only left_projection data####################
    index1_list = [9, 7, 5, 11]
    index2_list = [7, 5, 11, 13]
    index3_list = [5, 11, 13, 15]
    
    fo_out.writelines('\n')
    fo_out.writelines("........Printing data for markers from LEFT profile............")
    fo_out.writelines('\n')
    fo_out.writelines('\n')
    
    for pose in pose_list:
        fo_out.writelines("POSE ")
        fo_out.writelines(str(sequence+1))
        fo_out.writelines(". ")
        fo_out.writelines(pose)
        fo_out.writelines('\n')
        for angles in range(len(angle_marker)):
            
            ind_temp_1= index1_list[angles] + sequence*17
            ind_temp_2= index2_list[angles] + sequence*17
            ind_temp_3= index3_list[angles] + sequence*17
            fo_out.writelines("XY data for marker: "+str(df.loc[ind_temp_1,'biomarkers'])+" at index "+str(ind_temp_1))
            fo_out.writelines('\n')
            fo_out.writelines(str(XYdata.loc[ind_temp_1]))
            fo_out.writelines('\n')
            fo_out.writelines("XY data for marker: "+str(df.loc[ind_temp_2,'biomarkers'])+" at index "+str(ind_temp_2))
            fo_out.writelines('\n')
            fo_out.writelines(str(XYdata.loc[ind_temp_2]))
            fo_out.writelines('\n')
            fo_out.writelines("XY data for marker: "+str(df.loc[ind_temp_3,'biomarkers'])+" at index "+str(ind_temp_3))
            fo_out.writelines('\n')
            fo_out.writelines(str(XYdata.loc[ind_temp_3]))
            fo_out.writelines('\n')
            fo_out.writelines('\n')
            fo_out.writelines("Angle at left "+angle_marker[angles]+":")
            fo_out.writelines(str(calc_angle(XYdata,str(ind_temp_1),str(ind_temp_2),str(ind_temp_3))))
            fo_out.writelines('\n')
            fo_out.writelines('\n')
            
        sequence += 1
    fo_out.writelines('\n')
    fo_out.writelines("........Printed data for <"+str(sequence)+"> poses from LEFT profile............")
    fo_out.writelines('\n')
    ######repeat for right hand side data##########
    index1_list = [10, 8, 6, 12]
    index2_list = [8, 6, 12, 14]
    index3_list = [6, 12, 14, 16]
    fo_out.writelines('\n')
    fo_out.writelines("........Printing data for markers from RIGHT profile............")
    fo_out.writelines('\n')
    fo_out.writelines('\n')
    for pose in pose_list:
        fo_out.writelines(str(sequence_t+1))
        fo_out.writelines(".")
        fo_out.writelines(pose)
        fo_out.writelines('\n')
        for angles in range(len(angle_marker)):
            
            ind_temp_1= index1_list[angles] + sequence_t*17
            ind_temp_2= index2_list[angles] + sequence_t*17
            ind_temp_3= index3_list[angles] + sequence_t*17
            fo_out.writelines("XY data for marker: "+str(df.loc[ind_temp_1,'biomarkers'])+" at index "+str(ind_temp_1))
            fo_out.writelines('\n')
            fo_out.writelines(str(XYdata.loc[ind_temp_1]))
            fo_out.writelines('\n')
            fo_out.writelines("XY data for marker: "+str(df.loc[ind_temp_2,'biomarkers'])+" at index "+str(ind_temp_2))
            fo_out.writelines('\n')
            fo_out.writelines(str(XYdata.loc[ind_temp_2]))
            fo_out.writelines('\n')
            fo_out.writelines("XY data for marker: "+str(df.loc[ind_temp_3,'biomarkers'])+" at index "+str(ind_temp_3))
            fo_out.writelines('\n')
            fo_out.writelines(str(XYdata.loc[ind_temp_3]))
            fo_out.writelines('\n')
            fo_out.writelines('\n')
            fo_out.writelines("Angle at right "+angle_marker[angles]+":")
            fo_out.writelines(str(calc_angle(XYdata,str(ind_temp_1),str(ind_temp_2),str(ind_temp_3))))
            fo_out.writelines('\n')
            fo_out.writelines('\n')
            
        sequence_t += 1
    fo_out.writelines('\n')
    fo_out.writelines("........Printed data for <"+str(sequence_t)+"> poses from RIGHT profile............")
    fo_out.writelines('\n')
    fo_out.writelines('\n')
    fo_out.writelines("#################################################################################")
    fo_out.writelines('\n')
    fo_out.writelines("###########################Trained at AIYogi#####################################") 
    fo_out.writelines('\n') 
    fo_out.writelines("####################Debanjan, Rohan and Sumeru###################################") 
    fo_out.writelines('\n')
    fo_out.writelines("#################################################################################")
    fo_out.writelines('\n')
    fo_out.writelines('\n')
    print ("...........Output files written....................")
    fo_out.close()
    return 'angles extracted'
    

if __name__ == "__main__":
    main()
